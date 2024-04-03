from django.db import models
from django.contrib.auth.models import AbstractUser

# Si vous souhaitez étendre le modèle utilisateur par défaut
class CustomUser(AbstractUser):
    solde = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

class Categorie(models.Model):
    nom = models.CharField(max_length=255)
    image = models.CharField(max_length=255) 
    def __str__(self):
        return self.nom

class Challenge(models.Model):
    categorie = models.ForeignKey(Categorie, related_name="defis", on_delete=models.CASCADE, null=True, blank=True)
    titre = models.CharField(max_length=255)
    description_generale = models.TextField()  # Description générale du challenge
    niveau_difficulte = models.IntegerField()
    montant_recompense_total = models.DecimalField(max_digits=10, decimal_places=2)  # Optionnel, si vous voulez un montant total
    date_creation = models.DateTimeField(auto_now_add=True)
    date_expiration = models.DateTimeField(null=True, blank=True)
    image = models.CharField(max_length=255, null=True)  # Nouveau champ pour l'URL de l'image du challenge
    def __str__(self):
        return self.titre

class Palier(models.Model):
    challenge = models.ForeignKey(Challenge, related_name="paliers", on_delete=models.CASCADE)
    titre = models.CharField(max_length=255)
    description = models.TextField()
    niveau = models.IntegerField()  # Utilisé pour ordonner les paliers si nécessaire
    montant_recompense = models.DecimalField(max_digits=10, decimal_places=2)
    date_creation = models.DateTimeField(auto_now_add=True)

class Participation(models.Model):
    utilisateur = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    palier_atteint = models.IntegerField(default=0)
    date_participation = models.DateTimeField(auto_now_add=True)
    completé = models.BooleanField(default=False)

class Badge(models.Model):
    nom = models.CharField(max_length=255)
    description = models.TextField()
    condition_obtention = models.TextField()
    image = models.CharField(max_length=255, null=True, blank=True)

class AcquisitionBadge(models.Model):
    utilisateur = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    date_acquisition = models.DateTimeField(auto_now_add=True)

class Partenaire(models.Model):
    nom = models.CharField(max_length=255)
    description = models.TextField()
    montant_contribution = models.DecimalField(max_digits=10, decimal_places=2)
    date_contribution = models.DateTimeField()

class ContributionChallenge(models.Model):
    partenaire = models.ForeignKey(Partenaire, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField()

