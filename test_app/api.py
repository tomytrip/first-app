# test_app/api.py
from collections import defaultdict
from django.contrib.auth import get_user_model, authenticate, login as auth_login
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Challenge, Palier, Participation, CustomUser
from .models import Categorie
from django.conf import settings

from .serializers import CategorieSerializer, ChallengeSerializer, ChallengeSerializerBis, PalierSerializer, ParticipationSerializer

from django.http import JsonResponse
from django.db.models import Count, Q

User = get_user_model()

@csrf_exempt
@api_view(['POST'])
def signup(request):
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    username = email

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Un utilisateur avec cet email existe déjà'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
    token = Token.objects.create(user=user)
    return Response({'token': token.key})


@csrf_exempt
@api_view(['POST'])
def login_user(request):  # Renommée pour correspondre à urls.py
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, username=email, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
    else:
        return Response({'error': 'Email ou mot de passe incorrect'}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def defis_disponibles(request, categorie_id):
    utilisateur = request.user
    defis = Challenge.objects.filter(categorie_id=categorie_id).exclude(participation__utilisateur=utilisateur)
    serializer = ChallengeSerializer(defis, many=True)
    # Construire des URLs absolues pour les images des défis
    for defi in serializer.data:
        defi['image'] = request.build_absolute_uri(settings.STATIC_URL + defi['image'])
    return Response(serializer.data)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def paliers_du_challenge(request, challenge_id):
    paliers = Palier.objects.filter(challenge_id=challenge_id)
    serializer = PalierSerializer(paliers, many=True)
    # Construire des URLs absolues pour les images des défis
    # for defi in serializer.data:
    #     defi['image'] = request.build_absolute_uri(settings.STATIC_URL + defi['image'])
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def categories_avec_defis_filtre(request):
    user = request.user
    # Récupérer les IDs des défis auxquels l'utilisateur a déjà participé
    defis_participes_ids = Participation.objects.filter(utilisateur=user).values_list('challenge_id', flat=True)
    print(f"Défis participés par l'utilisateur {user.id}: {list(defis_participes_ids)}")
    # Filtrer les catégories pour ne retourner que celles ayant des défis auxquels l'utilisateur n'a pas participé
    categories_qs = Categorie.objects.annotate(
        nb_defis=Count('defis', filter=~Q(defis__id__in=defis_participes_ids))
    ).filter(nb_defis__gt=0)
    # Vérification des catégories sélectionnées avant la sérialisation
    for categorie in categories_qs:
        print(f"Catégorie: {categorie.nom}, Nombre de défis disponibles: {categorie.nb_defis}")
    # Sérialisation et retour des catégories
    serializer = CategorieSerializer(categories_qs, many=True, context={'request': request})
    for categorie in serializer.data:
        # S'assurer que le chemin vers l'image est correct
        categorie['image'] = request.build_absolute_uri(settings.STATIC_URL + categorie['image'])
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def defis_termines(request, categorie_id):
    defis_ids = Participation.objects.filter(utilisateur=request.user, completé=True).values_list('challenge_id', flat=True)
    defis = Challenge.objects.filter(id__in=defis_ids, categorie_id=categorie_id)
    serializer = ChallengeSerializer(defis, many=True)
    for categorie in serializer.data:
        categorie['image'] = request.build_absolute_uri(settings.STATIC_URL + categorie['image'])
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tous_defis_en_cours(request):
    utilisateur = request.user
    defis = Challenge.objects.filter(participation__utilisateur=utilisateur, participation__completé=False).select_related('categorie').order_by('categorie')
    
    defis_par_categorie = defaultdict(list)
    for defi in defis:
        serializer = ChallengeSerializerBis(defi, context={'request': request})
        defi_data = serializer.data
        # Convertir l'image du défi en URL absolue
        defi_data['image'] = request.build_absolute_uri(settings.STATIC_URL + defi_data['image'])
        defis_par_categorie[defi.categorie.nom].append(defi_data)
    
    resultat = []
    for categorie, defis in defis_par_categorie.items():
        if defis:
            categorie_data = {
                'nom': categorie,
                'image': defis[0]['categorie_image'],
                'defis': defis,
            }
            resultat.append(categorie_data)
    
    return Response(resultat)


@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def participer_challenge(request):
    utilisateur = request.user
    # Obtenez l'ID du challenge à partir du corps de la requête
    challenge_id = request.data.get('challenge')
    if challenge_id is None:
        return Response({'error': 'Challenge ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        challenge = Challenge.objects.get(id=challenge_id)
    except Challenge.DoesNotExist:
        return Response({'error': 'Challenge not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Créez une nouvelle participation avec l'utilisateur authentifié et le challenge
    participation = Participation(utilisateur=utilisateur, challenge=challenge, palier_atteint=0, completé=False)
    participation.save()

    # Utilisez le sérialiseur pour renvoyer la réponse
    serializer = ParticipationSerializer(participation)
    return Response(serializer.data, status=status.HTTP_201_CREATED)