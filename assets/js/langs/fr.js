Translation =  function ()
{
	this.get = () =>
	{
		var LANG = 
		{
			lang: "fr",
			views: 
			{
				pages: 
				{
					customers: 
					{
						sectionTitle: 'les clients',
						form01:{
							label01: "le nom de client",
							label02: "Poste CCP",
							label03: "Montant de la retenue mensuelle",
							label04: "Cette opération est-elle acceptable ?",
							label05: "Date de naissance",
							submitBTN01: "Ajouter une transaction",
							submitBTN02: "Ajouter à la liste noire"
						},
						title01: "Toutes transactions",
						btn01: "effacer",
						btn02: "Rechercher",
						inputPlaceholder01: "Rechercher...",
						label01: "recherche à partir de la date",
						label02: "à la date",
						table01: {
							th01: "Sélectionner tout",
							th02: "le nom de client",
							th03: "compte de messagerie",
							th04: "Tirage mensuel",
							th05: "cas pratique",
							th06: "Adresse du fournisseur",
							th07: "L'affaire a été conclue en",
							th08: "Operation",
							th09: "Date de naissance"
						}
					},
					settings:
					{
						sectionTitle: "Réglages",
						btn01: "Paramètres du compte",
						form01: {
							label01: "Prenom",
							label02: "l'état",
							label03: "Municipal",
							label04: "l'adresse",
							label05: "le téléphone",
							label06: "Mot de passe",
							label07: "Confirmez le mot de passe",
							submitBTN01: "Mettre à jour les paramètres"
						},
						form02:
						{
							label01: "Sélectionnez la langue d'affichage",
							submitBTN01: "Mettre à jour les paramètres"
						},
						btn02: "Paramètres d'affichage"
					},
					facilities:
					{
						sectionTitle: "Facilite",
						form01: {
							label01: "A partir de la date de",
							label02: "à la date",
							select01: {
								option01: "retrait d'argent",
								option02: "impôt",
								option03: "Attitude",
								option04: "dossier incomplet",
								option05: "impôt sans prélèvement",
								option06: "toutes les personnes"
							},
							select02: {
								option01: "Nombre de résultats affichés",
							},
							btn01: "Rechercher",
						},
						btn01: "Exporter le tableau sous :",
						title01: "Montant total",
						title02: "clé du tableau",
						text01: "impôt",
						text02: "retrait d'argent",
						text03: "Attitude",
						text04: "dossier incomplet"
					}
				},
				dialogs:
				{
					dialog_box:{
						btn01: "Fermer"
					},
					promptConfirmDialog:
					{
						btn01: "Bien",
						btn02: "Fermer"
					},
					promptInputDialog:
					{
						btn01: "Bien",
						btn02: "Fermer"
					}
				},
				addons:{
					userAuth:
					{
						title01: "Créer un compte",
						form01: {
							label01: "Nom du fournisseur",
							label02: "Téléphone",
							label03: "Mot de passe",
							label04: "l'état",
							label05: "Municipal",
							label06: "l'adresse",
							submitBTN01: "Créer un compte",
							formText01: "Se connecter"
						},
						title02: "Se connecter",
						form02: {
							label01: "Téléphone",
							label02: "Mot de passe",
							submitBTN01: "Se connecter",
							formText01: "création d'un compte"
						}
					}
				},
				partials:
				{
					sidebar: {
						nav01: "Ajouter une transaction",
						nav02: "Facilite",
						nav03: "Réglages",
						nav04: "Vérifier les mises à jour",
						nav05: "Se déconnecter",
						text01: "Tous droits réservés par Holoola-z © 2022",
						text02: "Contactez-nous par téléphone: "
					}
				}
			}
		}

		return LANG;
	}
};

module.exports = Translation;