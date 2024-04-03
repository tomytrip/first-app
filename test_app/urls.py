from django.urls import path
from .api import categories_avec_defis_filtre, defis_termines, paliers_du_challenge, participer_challenge, signup, login_user, defis_disponibles, tous_defis_en_cours

urlpatterns = [
    path('api/signup/', signup, name='signup'),
    path('api/login/', login_user, name='login'),
    path('api/paliers-du-challenge/<int:challenge_id>/', paliers_du_challenge, name='paliers-du-challenge'),
    path('api/categories/', categories_avec_defis_filtre, name='categories_avec_defis_filtre'),
    path('api/defis-disponibles/<int:categorie_id>/', defis_disponibles, name='defis-disponibles'),
    path('api/defis-termines/<int:categorie_id>/', defis_termines, name='defis-termines'),
    path('api/tous-defis-en-cours/', tous_defis_en_cours, name='tous-defis-en-cours'),
    path('api/participer/', participer_challenge, name='participer_challenge'),
]

