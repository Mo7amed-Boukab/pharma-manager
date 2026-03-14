from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Categorie
from .serializers import CategorieSerializer


class CategorieViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion des catégories de médicaments.
    
    Fournit les actions : list, create, retrieve, update, destroy.
    """
    queryset = Categorie.objects.all().order_by('nom')
    serializer_class = CategorieSerializer

    def destroy(self, request, *args, **kwargs):
        """
        Supprime une catégorie.
        Bloqué si des médicaments sont liés (PROTECT).
        """
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception:
            return Response(
                {'error': 'Impossible de supprimer cette catégorie car des médicaments y sont liés.'},
                status=status.HTTP_400_BAD_REQUEST
            )
