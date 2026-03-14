from django.db import models
from django.utils import timezone


class Vente(models.Model):
    """
    Représente une transaction de vente dans la pharmacie.

    Attributs:
        reference (str): Code unique auto-généré (ex: VNT-2026-0001).
        date_vente (datetime): Date et heure de la transaction.
        total_ttc (Decimal): Montant total calculé automatiquement.
        statut (str): État de la vente (en_cours, completee, annulee).
        notes (str): Remarques optionnelles.
    """

    STATUT_CHOICES = [
        ('en_cours', 'En cours'),
        ('completee', 'Complétée'),
        ('annulee', 'Annulée'),
    ]

    reference = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        verbose_name='Référence'
    )
    date_vente = models.DateTimeField(
        default=timezone.now,
        verbose_name='Date de vente'
    )
    total_ttc = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name='Total TTC'
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='completee',
        verbose_name='Statut'
    )
    notes = models.TextField(blank=True, null=True, verbose_name='Notes')

    class Meta:
        verbose_name = 'Vente'
        verbose_name_plural = 'Ventes'
        ordering = ['-date_vente']

    def save(self, *args, **kwargs):
        """
        Génère automatiquement la référence unique à la création.
        Réintègre le stock si la vente est annulée (ex: via Django Admin).
        """
        is_new = self.pk is None

        # Gestion de l'annulation et réintégration du stock
        if not is_new:
            old_instance = Vente.objects.get(pk=self.pk)
            if old_instance.statut != 'annulee' and self.statut == 'annulee':
                for ligne in self.lignes.all():
                    ligne.medicament.stock_actuel += ligne.quantite
                    ligne.medicament.save(update_fields=['stock_actuel'])

        super().save(*args, **kwargs)

        # Génération de la référence post-sauvegarde avec l'ID (Thread-Safe)
        if is_new and not self.reference:
            annee = timezone.now().year
            self.reference = f'VNT-{annee}-{str(self.pk).zfill(4)}'
            super().save(update_fields=['reference'])

    def __str__(self):
        return f'{self.reference} — {self.total_ttc} MAD'


class LigneVente(models.Model):
    """
    Représente une ligne d'article dans une vente.

    Attributs:
        vente (Vente): La vente parente.
        medicament (Medicament): Le médicament vendu.
        quantite (int): Quantité vendue.
        prix_unitaire (Decimal): Prix snapshot au moment de la vente.
        sous_total (Decimal): quantite × prix_unitaire.
    """

    vente = models.ForeignKey(
        Vente,
        on_delete=models.CASCADE,
        related_name='lignes',
        verbose_name='Vente'
    )
    medicament = models.ForeignKey(
        'medicaments.Medicament',
        on_delete=models.PROTECT,
        verbose_name='Médicament'
    )
    quantite = models.PositiveIntegerField(verbose_name='Quantité')
    prix_unitaire = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Prix unitaire'
    )
    sous_total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Sous-total'
    )

    class Meta:
        verbose_name = 'Ligne de vente'
        verbose_name_plural = 'Lignes de vente'

    def save(self, *args, **kwargs):
        """Calcule automatiquement le sous_total, déduit le stock et met à jour le total TTC parent."""
        is_new = self.pk is None

        # Affecter le prix unitaire actuel du médicament s'il n'est pas fourni
        if not self.prix_unitaire and self.medicament_id:
            self.prix_unitaire = self.medicament.prix_vente

        self.sous_total = self.quantite * self.prix_unitaire
        super().save(*args, **kwargs)

        if is_new:
            # 1. Déduction du stock au moment de la vente
            self.medicament.stock_actuel -= self.quantite
            self.medicament.save(update_fields=['stock_actuel'])

            # 2. Mise à jour du total de la vente parente
            self.vente.total_ttc += self.sous_total
            self.vente.save(update_fields=['total_ttc'])

    def __str__(self):
        return f'{self.medicament.nom} x{self.quantite}'