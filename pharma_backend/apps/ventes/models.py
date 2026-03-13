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
        """Génère automatiquement la référence unique à la création."""
        if not self.reference:
            annee = timezone.now().year
            derniere = Vente.objects.filter(
                reference__startswith=f'VNT-{annee}'
            ).count()
            self.reference = f'VNT-{annee}-{str(derniere + 1).zfill(4)}'
        super().save(*args, **kwargs)

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
        """Calcule automatiquement le sous_total avant sauvegarde."""
        self.sous_total = self.quantite * self.prix_unitaire
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.medicament.nom} x{self.quantite}'