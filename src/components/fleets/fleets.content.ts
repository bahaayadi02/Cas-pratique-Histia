import { t, type Dictionary } from "intlayer";

const fleetsContent = {
  key: "fleets",
  content: {
    help: t({ fr: "Aide", en: "Help" }),
    create: t({ fr: "Créer une flotte", en: "Create a fleet" }),
    directory: t({ fr: "Votre répertoire", en: "Your directory" }),
    title: t({ fr: "Vos flottes", en: "Your fleets" }),
    modalTitle: t({ fr: "Créez votre flotte", en: "Create your fleet" }),
    modalSubtitle: t({
      fr: "Commencez par définir le profil de votre future flotte",
      en: "Start by defining the profile of your future fleet",
    }),
    name: t({ fr: "Nom de la flotte", en: "Fleet name" }),
    namePlaceholder: t({ fr: "Renseignez un nom", en: "Enter a name" }),
    color: t({ fr: "Couleur", en: "Color" }),
    description: t({ fr: "Description", en: "Description" }),
    descriptionPlaceholder: t({
      fr: "Inscrivez une description sur le sujet de la flotte",
      en: "Enter a description of the fleet",
    }),
    cancel: t({ fr: "Annuler", en: "Cancel" }),
    submit: t({ fr: "Créer la flotte", en: "Create a fleet" }),
    companies: t({ fr: "entreprises", en: "companies" }),
    empty: t({ fr: "Aucune flotte pour le moment", en: "No fleets yet" }),
    return: t({ fr: "Retour", en: "Return" }),
    required: t({ fr: "Un nom est requis", en: "A name is required" }),
    loading: t({ fr: "Chargement...", en: "Loading..." }),
    previewTitleDefault: t({ fr: "Titre", en: "Title" }),
    previewDescDefault: t({ fr: "Description", en: "Description" }),
    fleetTag: t({ fr: "Flotte", en: "Fleet" }),
  },
} satisfies Dictionary;

export default fleetsContent;
