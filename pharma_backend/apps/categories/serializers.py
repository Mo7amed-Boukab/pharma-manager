from rest_framework import serializers
from .models import Categorie


class CategorieSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Categorie.
    Gère la création et la modification des catégories.
    """

    class Meta:
        model = Categorie
        fields = ['id', 'nom', 'description']

    def validate_nom(self, value):
        """Vérifie que le nom de la catégorie n'est pas vide."""
        if not value.strip():
            raise serializers.ValidationError("Le nom ne peut pas être vide.")
        return value.strip()