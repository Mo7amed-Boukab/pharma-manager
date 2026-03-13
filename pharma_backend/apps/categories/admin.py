from django.contrib import admin
from .models import Categorie


@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    """Administration des catégories de médicaments."""
    list_display = ['nom', 'description']
    search_fields = ['nom']