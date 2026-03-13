from django.contrib import admin
from .models import Vente, LigneVente


class LigneVenteInline(admin.TabularInline):
    """Affiche les lignes de vente directement dans la vente."""
    model = LigneVente
    extra = 0


@admin.register(Vente)
class VenteAdmin(admin.ModelAdmin):
    """Administration des ventes."""
    list_display = ['reference', 'date_vente', 'total_ttc', 'statut']
    list_filter = ['statut']
    inlines = [LigneVenteInline]