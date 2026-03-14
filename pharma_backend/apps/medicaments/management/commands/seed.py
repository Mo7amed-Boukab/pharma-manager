from django.core.management.base import BaseCommand
from apps.categories.models import Categorie
from apps.medicaments.models import Medicament
from apps.ventes.models import LigneVente, Vente


CATEGORIES = [
    {
        "nom": "Antalgiques / Antipyrétiques",
        "description": "Médicaments utilisés pour soulager la douleur et réduire la fièvre.",
    },
    {
        "nom": "Antibiotiques",
        "description": "Médicaments utilisés pour traiter les infections bactériennes.",
    },
    {
        "nom": "Anti-inflammatoires",
        "description": "Médicaments réduisant l'inflammation, la douleur et la fièvre.",
    },
    {
        "nom": "Antihistaminiques",
        "description": "Médicaments utilisés contre les réactions allergiques.",
    },
    {
        "nom": "Antispasmodiques",
        "description": "Médicaments qui soulagent les spasmes musculaires et les douleurs digestives.",
    },
    {
        "nom": "Bronchodilatateurs",
        "description": "Médicaments qui dilatent les voies aériennes pour faciliter la respiration.",
    },
    {
        "nom": "Antihypertenseurs",
        "description": "Médicaments utilisés pour traiter l'hypertension artérielle.",
    },
    {
        "nom": "Antidiabétiques",
        "description": "Médicaments utilisés pour contrôler la glycémie chez les diabétiques.",
    },
    {
        "nom": "Vitamines et suppléments",
        "description": "Compléments alimentaires et vitamines pour combler les carences nutritionnelles.",
    },
    {
        "nom": "Dermatologie",
        "description": "Médicaments appliqués sur la peau pour traiter diverses affections cutanées.",
    },
]

# Chaque médicament référence la catégorie par son nom exact (clé dans CATEGORIES)
MEDICAMENTS = [
    # ─── Antalgiques / Antipyrétiques ───────────────────────────────────────
    {
        "nom": "Doliprane 1000mg",
        "dci": "Paracétamol",
        "categorie": "Antalgiques / Antipyrétiques",
        "forme": "comprime",
        "dosage": "1000mg",
        "prix_achat": "8.50",
        "prix_vente": "15.00",
        "stock_actuel": 120,
        "stock_minimum": 20,
        "date_expiration": "2027-06-30",
        "ordonnance_requise": False,
    },
    {
        "nom": "Panadol 500mg",
        "dci": "Paracétamol",
        "categorie": "Antalgiques / Antipyrétiques",
        "forme": "comprime",
        "dosage": "500mg",
        "prix_achat": "5.00",
        "prix_vente": "9.50",
        "stock_actuel": 8,
        "stock_minimum": 15,
        "date_expiration": "2027-03-31",
        "ordonnance_requise": False,
    },
    {
        "nom": "Efferalgan 500mg Effervescent",
        "dci": "Paracétamol",
        "categorie": "Antalgiques / Antipyrétiques",
        "forme": "comprime",
        "dosage": "500mg",
        "prix_achat": "9.00",
        "prix_vente": "17.00",
        "stock_actuel": 60,
        "stock_minimum": 15,
        "date_expiration": "2026-12-31",
        "ordonnance_requise": False,
    },
    {
        "nom": "Codoliprane",
        "dci": "Paracétamol + Codéine",
        "categorie": "Antalgiques / Antipyrétiques",
        "forme": "comprime",
        "dosage": "500mg/30mg",
        "prix_achat": "14.00",
        "prix_vente": "25.00",
        "stock_actuel": 5,
        "stock_minimum": 10,
        "date_expiration": "2026-09-30",
        "ordonnance_requise": True,
    },
    # ─── Antibiotiques ───────────────────────────────────────────────────────
    {
        "nom": "Augmentin 1g",
        "dci": "Amoxicilline / Acide clavulanique",
        "categorie": "Antibiotiques",
        "forme": "comprime",
        "dosage": "1000mg/125mg",
        "prix_achat": "22.00",
        "prix_vente": "40.00",
        "stock_actuel": 45,
        "stock_minimum": 10,
        "date_expiration": "2027-01-31",
        "ordonnance_requise": True,
    },
    {
        "nom": "Clamoxyl 500mg",
        "dci": "Amoxicilline",
        "categorie": "Antibiotiques",
        "forme": "capsule",
        "dosage": "500mg",
        "prix_achat": "12.00",
        "prix_vente": "22.00",
        "stock_actuel": 30,
        "stock_minimum": 10,
        "date_expiration": "2027-04-30",
        "ordonnance_requise": True,
    },
    {
        "nom": "Zithromax 250mg",
        "dci": "Azithromycine",
        "categorie": "Antibiotiques",
        "forme": "comprime",
        "dosage": "250mg",
        "prix_achat": "30.00",
        "prix_vente": "55.00",
        "stock_actuel": 20,
        "stock_minimum": 8,
        "date_expiration": "2027-07-31",
        "ordonnance_requise": True,
    },
    {
        "nom": "Ciprofloxacine 500mg",
        "dci": "Ciprofloxacine",
        "categorie": "Antibiotiques",
        "forme": "comprime",
        "dosage": "500mg",
        "prix_achat": "18.00",
        "prix_vente": "32.00",
        "stock_actuel": 25,
        "stock_minimum": 10,
        "date_expiration": "2026-11-30",
        "ordonnance_requise": True,
    },
    # ─── Anti-inflammatoires ─────────────────────────────────────────────────
    {
        "nom": "Voltarène 50mg",
        "dci": "Diclofénac",
        "categorie": "Anti-inflammatoires",
        "forme": "comprime",
        "dosage": "50mg",
        "prix_achat": "10.00",
        "prix_vente": "18.00",
        "stock_actuel": 55,
        "stock_minimum": 12,
        "date_expiration": "2027-05-31",
        "ordonnance_requise": False,
    },
    {
        "nom": "Advil 400mg",
        "dci": "Ibuprofène",
        "categorie": "Anti-inflammatoires",
        "forme": "comprime",
        "dosage": "400mg",
        "prix_achat": "7.00",
        "prix_vente": "13.00",
        "stock_actuel": 80,
        "stock_minimum": 20,
        "date_expiration": "2027-02-28",
        "ordonnance_requise": False,
    },
    {
        "nom": "Profénid 100mg",
        "dci": "Kétoprofène",
        "categorie": "Anti-inflammatoires",
        "forme": "capsule",
        "dosage": "100mg",
        "prix_achat": "16.00",
        "prix_vente": "28.00",
        "stock_actuel": 4,
        "stock_minimum": 10,
        "date_expiration": "2026-10-31",
        "ordonnance_requise": True,
    },
    # ─── Antihistaminiques ───────────────────────────────────────────────────
    {
        "nom": "Zyrtec 10mg",
        "dci": "Cétirizine",
        "categorie": "Antihistaminiques",
        "forme": "comprime",
        "dosage": "10mg",
        "prix_achat": "11.00",
        "prix_vente": "20.00",
        "stock_actuel": 35,
        "stock_minimum": 10,
        "date_expiration": "2027-08-31",
        "ordonnance_requise": False,
    },
    {
        "nom": "Clarityne 10mg",
        "dci": "Loratadine",
        "categorie": "Antihistaminiques",
        "forme": "comprime",
        "dosage": "10mg",
        "prix_achat": "9.50",
        "prix_vente": "17.00",
        "stock_actuel": 3,
        "stock_minimum": 10,
        "date_expiration": "2027-06-30",
        "ordonnance_requise": False,
    },
    {
        "nom": "Aerius 5mg",
        "dci": "Desloratadine",
        "categorie": "Antihistaminiques",
        "forme": "comprime",
        "dosage": "5mg",
        "prix_achat": "20.00",
        "prix_vente": "35.00",
        "stock_actuel": 15,
        "stock_minimum": 8,
        "date_expiration": "2027-03-31",
        "ordonnance_requise": False,
    },
    # ─── Antispasmodiques ────────────────────────────────────────────────────
    {
        "nom": "Spasfon Lyoc",
        "dci": "Phloroglucinol",
        "categorie": "Antispasmodiques",
        "forme": "comprime",
        "dosage": "80mg",
        "prix_achat": "13.00",
        "prix_vente": "24.00",
        "stock_actuel": 65,
        "stock_minimum": 15,
        "date_expiration": "2027-09-30",
        "ordonnance_requise": False,
    },
    {
        "nom": "Duspatalin 200mg",
        "dci": "Mébévérine",
        "categorie": "Antispasmodiques",
        "forme": "capsule",
        "dosage": "200mg",
        "prix_achat": "18.00",
        "prix_vente": "32.00",
        "stock_actuel": 28,
        "stock_minimum": 10,
        "date_expiration": "2027-01-31",
        "ordonnance_requise": False,
    },
    # ─── Bronchodilatateurs ──────────────────────────────────────────────────
    {
        "nom": "Ventoline 100mcg",
        "dci": "Salbutamol",
        "categorie": "Bronchodilatateurs",
        "forme": "autre",
        "dosage": "100mcg/dose",
        "prix_achat": "25.00",
        "prix_vente": "45.00",
        "stock_actuel": 18,
        "stock_minimum": 8,
        "date_expiration": "2027-04-30",
        "ordonnance_requise": True,
    },
    {
        "nom": "Atrovent 20mcg",
        "dci": "Ipratropium",
        "categorie": "Bronchodilatateurs",
        "forme": "autre",
        "dosage": "20mcg/dose",
        "prix_achat": "35.00",
        "prix_vente": "60.00",
        "stock_actuel": 7,
        "stock_minimum": 5,
        "date_expiration": "2027-02-28",
        "ordonnance_requise": True,
    },
    # ─── Antihypertenseurs ───────────────────────────────────────────────────
    {
        "nom": "Amlodipine 5mg",
        "dci": "Amlodipine",
        "categorie": "Antihypertenseurs",
        "forme": "comprime",
        "dosage": "5mg",
        "prix_achat": "8.00",
        "prix_vente": "14.00",
        "stock_actuel": 90,
        "stock_minimum": 20,
        "date_expiration": "2027-07-31",
        "ordonnance_requise": True,
    },
    {
        "nom": "Coversyl 5mg",
        "dci": "Périndopril",
        "categorie": "Antihypertenseurs",
        "forme": "comprime",
        "dosage": "5mg",
        "prix_achat": "20.00",
        "prix_vente": "36.00",
        "stock_actuel": 2,
        "stock_minimum": 10,
        "date_expiration": "2027-05-31",
        "ordonnance_requise": True,
    },
    {
        "nom": "Losartan 50mg",
        "dci": "Losartan",
        "categorie": "Antihypertenseurs",
        "forme": "comprime",
        "dosage": "50mg",
        "prix_achat": "15.00",
        "prix_vente": "27.00",
        "stock_actuel": 40,
        "stock_minimum": 15,
        "date_expiration": "2027-08-31",
        "ordonnance_requise": True,
    },
    # ─── Antidiabétiques ─────────────────────────────────────────────────────
    {
        "nom": "Glucophage 850mg",
        "dci": "Metformine",
        "categorie": "Antidiabétiques",
        "forme": "comprime",
        "dosage": "850mg",
        "prix_achat": "6.00",
        "prix_vente": "11.00",
        "stock_actuel": 75,
        "stock_minimum": 20,
        "date_expiration": "2027-06-30",
        "ordonnance_requise": True,
    },
    {
        "nom": "Diamicron MR 60mg",
        "dci": "Gliclazide",
        "categorie": "Antidiabétiques",
        "forme": "comprime",
        "dosage": "60mg",
        "prix_achat": "18.00",
        "prix_vente": "32.00",
        "stock_actuel": 9,
        "stock_minimum": 15,
        "date_expiration": "2027-03-31",
        "ordonnance_requise": True,
    },
    # ─── Vitamines et suppléments ─────────────────────────────────────────────
    {
        "nom": "Vitamine C 1000mg",
        "dci": "Acide ascorbique",
        "categorie": "Vitamines et suppléments",
        "forme": "comprime",
        "dosage": "1000mg",
        "prix_achat": "6.00",
        "prix_vente": "11.00",
        "stock_actuel": 100,
        "stock_minimum": 25,
        "date_expiration": "2027-09-30",
        "ordonnance_requise": False,
    },
    {
        "nom": "Vitamine D3 1000UI",
        "dci": "Cholécalciférol",
        "categorie": "Vitamines et suppléments",
        "forme": "capsule",
        "dosage": "1000 UI",
        "prix_achat": "10.00",
        "prix_vente": "19.00",
        "stock_actuel": 50,
        "stock_minimum": 15,
        "date_expiration": "2027-07-31",
        "ordonnance_requise": False,
    },
    {
        "nom": "Magné B6",
        "dci": "Magnésium + Pyridoxine",
        "categorie": "Vitamines et suppléments",
        "forme": "comprime",
        "dosage": "470mg/5mg",
        "prix_achat": "12.00",
        "prix_vente": "22.00",
        "stock_actuel": 6,
        "stock_minimum": 15,
        "date_expiration": "2027-04-30",
        "ordonnance_requise": False,
    },
    # ─── Dermatologie ────────────────────────────────────────────────────────
    {
        "nom": "Biafine Emulsion",
        "dci": "Tréthanolamine",
        "categorie": "Dermatologie",
        "forme": "pommade",
        "dosage": "1mg/g",
        "prix_achat": "14.00",
        "prix_vente": "26.00",
        "stock_actuel": 22,
        "stock_minimum": 8,
        "date_expiration": "2027-05-31",
        "ordonnance_requise": False,
    },
    {
        "nom": "Betadine 10% Solution",
        "dci": "Povidone iodée",
        "categorie": "Dermatologie",
        "forme": "sirop",
        "dosage": "10%",
        "prix_achat": "11.00",
        "prix_vente": "20.00",
        "stock_actuel": 30,
        "stock_minimum": 10,
        "date_expiration": "2027-01-31",
        "ordonnance_requise": False,
    },
    {
        "nom": "Fucidine Crème 2%",
        "dci": "Acide fusidique",
        "categorie": "Dermatologie",
        "forme": "pommade",
        "dosage": "2%",
        "prix_achat": "19.00",
        "prix_vente": "34.00",
        "stock_actuel": 3,
        "stock_minimum": 8,
        "date_expiration": "2026-12-31",
        "ordonnance_requise": True,
    },
]


class Command(BaseCommand):
    """
    Management command pour peupler la base de données avec des données initiales.

    Usage:
        python manage.py seed           # Ajoute les données (ignore les doublons)
        python manage.py seed --flush   # Supprime toutes les données existantes puis réinsère
    """

    help = "Peuple la base de données avec les catégories et les médicaments de démonstration."

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Supprime toutes les données existantes avant de réinsérer.",
        )

    def handle(self, *args, **options):
        if options["flush"]:
            self.stdout.write(self.style.WARNING("Suppression des données existantes..."))
            LigneVente.objects.all().delete()
            Vente.objects.all().delete()
            Medicament.objects.all().delete()
            Categorie.objects.all().delete()
            self.stdout.write(self.style.WARNING("Données supprimées."))

        # ── 1. Catégories ────────────────────────────────────────────────────
        self.stdout.write("\nInsertion des catégories...")
        categories_map: dict[str, Categorie] = {}
        cat_created = 0
        cat_skipped = 0

        for cat_data in CATEGORIES:
            obj, created = Categorie.objects.get_or_create(
                nom=cat_data["nom"],
                defaults={"description": cat_data["description"]},
            )
            categories_map[obj.nom] = obj
            if created:
                cat_created += 1
                self.stdout.write(f"  ✓ {obj.nom}")
            else:
                cat_skipped += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Catégories : {cat_created} créées, {cat_skipped} déjà existantes."
            )
        )

        # ── 2. Médicaments ───────────────────────────────────────────────────
        self.stdout.write("\nInsertion des médicaments...")
        med_created = 0
        med_skipped = 0
        med_errors = 0

        for med_data in MEDICAMENTS:
            cat_nom = med_data.pop("categorie")
            cat_obj = categories_map.get(cat_nom)

            if cat_obj is None:
                self.stdout.write(
                    self.style.ERROR(
                        f"  ✗ Catégorie introuvable « {cat_nom} » pour {med_data['nom']}"
                    )
                )
                med_data["categorie"] = cat_nom  # restore for next seed attempt
                med_errors += 1
                continue

            obj, created = Medicament.objects.get_or_create(
                nom=med_data["nom"],
                defaults={**med_data, "categorie": cat_obj},
            )
            # restore key for idempotency (list is iterated only once but be safe)
            med_data["categorie"] = cat_nom

            if created:
                med_created += 1
                alert_marker = " ⚠ stock bas" if obj.est_en_alerte else ""
                self.stdout.write(f"  ✓ {obj.nom}{alert_marker}")
            else:
                med_skipped += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Médicaments : {med_created} créés, {med_skipped} déjà existants, {med_errors} erreurs."
            )
        )

        # ── Résumé ───────────────────────────────────────────────────────────
        alerte_count = Medicament.objects.filter(est_actif=True).count()
        low_stock = sum(
            1 for m in Medicament.objects.filter(est_actif=True)
            if m.est_en_alerte
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"\n✅ Seed terminé — {alerte_count} médicaments actifs dont {low_stock} en alerte de stock."
            )
        )
