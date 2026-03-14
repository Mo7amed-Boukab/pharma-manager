from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from .models import Medicament
from .serializers import MedicamentSerializer


class MedicamentViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion complète des médicaments.

    Fournit les actions : list, create, retrieve, update, destroy.
    Inclut un endpoint custom /alertes/ pour les stocks bas.
    """
    serializer_class = MedicamentSerializer

    def get_queryset(self):
        """
        Retourne uniquement les médicaments actifs.
        Supporte la recherche par nom via ?search=
        """
        queryset = Medicament.objects.filter(est_actif=True).select_related('categorie')
        
        # Filtre par recherche
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(nom__icontains=search)
        
        # Filtre par catégorie
        categorie = self.request.query_params.get('categorie')
        if categorie:
            queryset = queryset.filter(categorie__id=categorie)
        
        return queryset.order_by('nom')

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete : marque le médicament comme inactif
        au lieu de le supprimer de la base de données.
        """
        medicament = self.get_object()
        medicament.est_actif = False
        medicament.save()
        return Response(
            {'message': f'Médicament {medicament.nom} archivé avec succès.'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'], url_path='alertes')
    def alertes(self, request):
        """
        Endpoint custom : GET /api/v1/medicaments/alertes/
        Retourne les médicaments dont le stock est sous le seuil minimum.
        """
        medicaments_alertes = Medicament.objects.filter(
            est_actif=True,
            stock_actuel__lte=models.F('stock_minimum')
        )
        serializer = self.get_serializer(medicaments_alertes, many=True)
        return Response({
            'count': medicaments_alertes.count(),
            'results': serializer.data
        })
