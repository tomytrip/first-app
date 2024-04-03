from django.contrib import admin
from .models import CustomUser, Challenge, Participation, Badge, AcquisitionBadge, Partenaire, ContributionChallenge

admin.site.register(CustomUser)
admin.site.register(Challenge)
admin.site.register(Participation)
admin.site.register(Badge)
admin.site.register(AcquisitionBadge)
admin.site.register(Partenaire)
admin.site.register(ContributionChallenge)

