from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Vente
from .serializers import VenteSerializer, VenteListSerializer


class VenteViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion des ventes.

    Fournit les actions : list, create, retrieve.
    Inclut un endpoint custom /{id}/annuler/ pour annuler une vente.
    """
    
    def get_queryset(self):
        """
        Retourne l'historique des ventes.
        Supporte le filtrage par date via ?date=YYYY-MM-DD
        """
        queryset = Vente.objects.prefetch_related('lignes__medicament').order_by('-date_vente')
        
        # Filtre par date
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(date_vente__date=date)
        
        # Filtre par statut
        statut = self.request.query_params.get('statut')
        if statut:
            queryset = queryset.filter(statut=statut)
            
        return queryset

    def get_serializer_class(self):
        """
        Utilise un serializer léger pour la liste,
        et le serializer complet pour le détail/création.
        """
        if self.action == 'list':
            return VenteListSerializer
        return VenteSerializer

    @action(detail=True, methods=['post'], url_path='annuler')
    @transaction.atomic
    def annuler(self, request, pk=None):
        """
        Endpoint custom : POST /api/v1/ventes/{id}/annuler/
        Annule une vente et le modèle Vente (save) réintègre les stocks des médicaments.
        """
        vente = self.get_object()

        # Vérification que la vente n'est pas déjà annulée
        if vente.statut == 'annulee':
            return Response(
                {'error': 'Cette vente est déjà annulée.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mise à jour du statut (le modèle Vente interceptera ce statut pour réintégrer les stocks)
        vente.statut = 'annulee'
        vente.save()

        return Response(
            {'message': f'Vente {vente.reference} annulée. Stocks réintégrés.'},
            status=status.HTTP_200_OK
        )
