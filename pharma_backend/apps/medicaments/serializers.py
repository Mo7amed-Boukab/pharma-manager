from rest_framework import serializers
from .models import Medicament
from apps.categories.serializers import CategorieSerializer


class MedicamentSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Medicament.
    Inclut les informations de la catégorie et l'état d'alerte stock.
    """
    categorie_detail = CategorieSerializer(source='categorie', read_only=True)
    est_en_alerte = serializers.BooleanField(read_only=True)

    class Meta:
        model = Medicament
        fields = [
            'id', 'nom', 'dci', 'categorie', 'categorie_detail',
            'forme', 'dosage', 'prix_achat', 'prix_vente',
            'stock_actuel', 'stock_minimum', 'date_expiration',
            'ordonnance_requise', 'date_creation', 'est_actif',
            'est_en_alerte'
        ]
        read_only_fields = ['date_creation', 'est_en_alerte']

    def validate_prix_vente(self, value):
        """Vérifie que le prix de vente est positif."""
        if value <= 0:
            raise serializers.ValidationError("Le prix de vente doit être positif.")
        return value

    def validate_stock_minimum(self, value):
        """Vérifie que le stock minimum est positif."""
        if value < 0:
            raise serializers.ValidationError("Le stock minimum ne peut pas être négatif.")
        return value

    def validate(self, data):
        """Vérifie que le prix de vente est supérieur au prix d'achat."""
        prix_achat = data.get('prix_achat')
        prix_vente = data.get('prix_vente')
        if prix_achat and prix_vente and prix_vente < prix_achat:
            raise serializers.ValidationError({
                'prix_vente': "Le prix de vente doit être supérieur au prix d'achat."
            })
        return data