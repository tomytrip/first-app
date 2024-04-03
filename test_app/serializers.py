from django.conf import settings
from rest_framework import serializers
from .models import Categorie, Challenge, Palier, Participation


class ParticipationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participation
        fields = ['utilisateur', 'challenge', 'palier_atteint', 'date_participation', 'completé']


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ['id', 'nom', 'image']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            image_url = obj.image
            return request.build_absolute_uri(settings.MEDIA_URL + image_url)
        return None


class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ['id', 'titre', 'description_generale', 'image']


class ChallengeSerializerBis(serializers.ModelSerializer):
    categorie_image = serializers.SerializerMethodField()

    class Meta:
        model = Challenge
        fields = ['id', 'titre', 'description_generale', 'image', 'categorie_image']

    def get_categorie_image(self, obj):
        # Assurez-vous que l'objet Challenge a une relation avec Categorie qui fonctionne
        # et que l'objet Categorie a bien un champ 'image'
        if obj.categorie and obj.categorie.image:
            request = self.context.get('request')
            categorie_image_url = obj.categorie.image
            return request.build_absolute_uri(settings.STATIC_URL + categorie_image_url)
        return None


class PalierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Palier
        fields = ['titre', 'description', 'niveau', 'montant_recompense']