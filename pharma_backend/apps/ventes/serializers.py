from rest_framework import serializers
from django.db import transaction
from .models import Vente, LigneVente
from apps.medicaments.models import Medicament


class LigneVenteSerializer(serializers.ModelSerializer):
    """
    Serializer pour une ligne de vente.
    Le prix_unitaire est un snapshot automatique du prix de vente du médicament.
    """
    medicament_nom = serializers.CharField(source='medicament.nom', read_only=True)

    class Meta:
        model = LigneVente
        fields = ['id', 'medicament', 'medicament_nom', 'quantite', 'prix_unitaire', 'sous_total']
        read_only_fields = ['prix_unitaire', 'sous_total']


class VenteSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Vente.
    Gère la création d'une vente avec ses lignes et la déduction du stock.
    """
    lignes = LigneVenteSerializer(many=True)
    
    class Meta:
        model = Vente
        fields = ['id', 'reference', 'date_vente', 'total_ttc', 'statut', 'notes', 'lignes']
        read_only_fields = ['reference', 'total_ttc']

    def validate_lignes(self, lignes):
        """Vérifie que la vente contient au moins une ligne."""
        if not lignes:
            raise serializers.ValidationError("Une vente doit contenir au moins un article.")
        return lignes

    def validate(self, data):
        """Vérifie que le stock est suffisant pour chaque médicament."""
        lignes = data.get('lignes', [])
        for ligne in lignes:
            medicament = ligne['medicament']
            quantite = ligne['quantite']
            if medicament.stock_actuel < quantite:
                raise serializers.ValidationError({
                    'lignes': f"Stock insuffisant pour {medicament.nom}. "
                              f"Disponible: {medicament.stock_actuel}, Demandé: {quantite}"
                })
        return data

    @transaction.atomic
    def create(self, validated_data):
        """
        Crée la vente avec ses lignes et déduit le stock automatiquement.
        Utilise une transaction pour garantir l'intégrité des données.
        """
        lignes_data = validated_data.pop('lignes')
        vente = Vente.objects.create(**validated_data)
        total = 0

        for ligne_data in lignes_data:
            medicament = ligne_data['medicament']
            quantite = ligne_data['quantite']
            prix_unitaire = medicament.prix_vente  # snapshot du prix actuel

            ligne = LigneVente.objects.create(
                vente=vente,
                medicament=medicament,
                quantite=quantite,
                prix_unitaire=prix_unitaire,
            )
            total += ligne.sous_total

            # Déduction du stock
            medicament.stock_actuel -= quantite
            medicament.save()

        vente.total_ttc = total
        vente.save()
        return vente


class VenteListSerializer(serializers.ModelSerializer):
    """Serializer léger pour la liste des ventes (sans les lignes détaillées)."""

    class Meta:
        model = Vente
        fields = ['id', 'reference', 'date_vente', 'total_ttc', 'statut']