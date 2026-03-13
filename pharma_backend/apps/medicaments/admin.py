from django.contrib import admin
from .models import Medicament


@admin.register(Medicament)
class MedicamentAdmin(admin.ModelAdmin):
    """Administration des médicaments."""
    list_display = ['nom', 'categorie', 'stock_actuel', 'stock_minimum', 'prix_vente', 'est_actif']
    list_filter = ['categorie', 'est_actif', 'ordonnance_requise']
    search_fields = ['nom', 'dci']