"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import type * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

import { Button } from "@/components/button";
import { MODAL_IDS, Modal, useModalActions } from "@/components/modal";
import { FLEET_COLORS, DEFAULT_FLEET_COLOR, type Fleet } from "@/lib/fleet";
import { useFleetsQuery, useCreateFleetMutation, FALLBACK_SEED_FLEETS } from "@/lib/use-fleets";
import { TiltCard } from "./TiltCard";
import {
  BuildingIcon,
  ChevronRightIcon,
  DotsIcon,
  FolderIcon,
  InfoIcon,
  SparkleIcon,
} from "@/icons";

import "./fleets.css";

export type Locale = "fr" | "en";

const helpTexts: Record<Locale, { title: string; items: string[] }> = {
  fr: {
    title: "Comment créer une flotte ?",
    items: [
      "Donnez un nom unique à votre flotte pour la retrouver facilement.",
      "Choisissez une couleur pour personnaliser l'apparence de votre flotte dans le répertoire.",
      "Ajoutez une description pour expliquer l'objectif de votre flotte aux autres membres.",
      "La carte de prévisualisation à gauche reflète vos modifications en temps réel.",
      "Cliquez sur \"Créer la flotte\" une fois satisfait — elle apparaîtra immédiatement.",
    ],
  },
  en: {
    title: "How to create a fleet?",
    items: [
      "Give your fleet a unique name to easily find it later.",
      "Choose a color to personalize how your fleet appears in the directory.",
      "Add a description to explain the purpose of your fleet to team members.",
      "The preview card on the left reflects your changes in real time.",
      "Click \"Create a fleet\" when you're satisfied — it will appear immediately.",
    ],
  },
};

const copy: Record<
  Locale,
  {
    help: string;
    create: string;
    directory: string;
    title: string;
    modalTitle: string;
    modalSubtitle: string;
    name: string;
    namePlaceholder: string;
    color: string;
    description: string;
    descriptionPlaceholder: string;
    cancel: string;
    submit: string;
    companies: string;
    empty: string;
    return: string;
    required: string;
    loading: string;
    previewTitleDefault: string;
    previewDescDefault: string;
    fleetTag: string;
  }
> = {
  fr: {
    help: "Aide",
    create: "Créer une flotte",
    directory: "Votre répertoire",
    title: "Vos flottes",
    modalTitle: "Créez votre flotte",
    modalSubtitle: "Commencez par définir le profil de votre future flotte",
    name: "Nom de la flotte",
    namePlaceholder: "Renseignez un nom",
    color: "Couleur",
    description: "Description",
    descriptionPlaceholder: "Inscrivez une description sur le sujet de la flotte",
    cancel: "Annuler",
    submit: "Créer la flotte",
    companies: "entreprises",
    empty: "Aucune flotte pour le moment",
    return: "Retour",
    required: "Un nom est requis",
    loading: "Chargement...",
    previewTitleDefault: "Titre",
    previewDescDefault: "Description",
    fleetTag: "Flotte",
  },
  en: {
    help: "Help",
    create: "Create a fleet",
    directory: "Your directory",
    title: "Your fleets",
    modalTitle: "Create your fleet",
    modalSubtitle: "Start by defining the profile of your future fleet",
    name: "Fleet name",
    namePlaceholder: "Enter a name",
    color: "Color",
    description: "Description",
    descriptionPlaceholder: "Enter a description of the fleet",
    cancel: "Cancel",
    submit: "Create a fleet",
    companies: "companies",
    empty: "No fleets yet",
    return: "Return",
    required: "A name is required",
    loading: "Loading...",
    previewTitleDefault: "Title",
    previewDescDefault: "Description",
    fleetTag: "Fleet",
  },
};

const formSchema = z.object({
  name: z.string().trim().min(1, "A name is required"),
  description: z.string().trim().max(240, "Description is too long"),
});

type FormValues = z.infer<typeof formSchema>;

/** Individual Fleet Card on the Directory Grid */
function FleetCard({ fleet, locale }: { fleet: Fleet; locale: Locale }) {
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    node.style.setProperty("--rx", `${rotateX}deg`);
    node.style.setProperty("--ry", `${rotateY}deg`);
  };

  const resetRotation = () => {
    const node = cardRef.current;
    if (!node) return;
    node.style.setProperty("--rx", "0deg");
    node.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      ref={cardRef}
      className="fleet-card"
      style={{ "--accent": fleet.color } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetRotation}
    >
      <div className="fleet-card__glow" />
      <button
        className="fleet-card__menu"
        aria-label="Actions de la flotte"
        type="button"
      >
        <DotsIcon className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
      </button>
      <div className="fleet-card__body">
        <h2>{fleet.name}</h2>
        <p>{fleet.description || "—"}</p>
      </div>
      <div className="fleet-card__companies">
        <BuildingIcon className="w-4 h-4 inline-block mr-1.5 opacity-80" />
        <span>
          {fleet.companies} {copy[locale].companies}
        </span>
      </div>
    </article>
  );
}

/** Live Synchronized 3D Preview Card inside the Creation Modal */
function PreviewCard({
  values,
  color,
  locale,
}: {
  values: Partial<FormValues>;
  color: string;
  locale: Locale;
}) {
  const text = copy[locale];
  const title = values.name?.trim() || text.previewTitleDefault;
  const description = values.description?.trim() || text.previewDescDefault;

  return (
    <div className="preview-wrap-figma">
      <div className="preview-breadcrumb-figma">
        <span>{text.directory}</span>
        <ChevronRightIcon className="w-3.5 h-3.5 opacity-60 inline mx-1.5" />
        <strong>{title}</strong>
      </div>

      <TiltCard
        accentColor={color}
        maxTilt={12}
        perspective={1200}
        glareOpacity={0.25}
        className="preview-card-container-figma"
      >
        <div
          className="preview-card-inner-figma"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${color} 40%, #15132b) 0%, #15132b 50%)`,
          }}
        >
          <div className="preview-card__top">
            <span className="preview-card__tag">
              <FolderIcon className="w-4 h-4 mr-2 inline-block opacity-80" />
              {text.fleetTag}
            </span>
            <span className="preview-card__dots">
              <DotsIcon className="w-4 h-4 opacity-50" />
            </span>
          </div>

          <div className="preview-card__body-figma">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}

/** Fleet Creation Modal matching exact Figma overlay layout */
function CreateFleetModal({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const help = helpTexts[locale];
  const { closeModal } = useModalActions();
  const [color, setColor] = useState<string>(DEFAULT_FLEET_COLOR);
  const [showHelp, setShowHelp] = useState(false);
  const createMutation = useCreateFleetMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
    mode: "onChange",
  });

  const values = useWatch({ control });

  const onSubmit = async (data: FormValues) => {
    try {
      await createMutation.mutateAsync({
        name: data.name.trim(),
        description: data.description.trim(),
        color,
      });
      reset();
      setColor(DEFAULT_FLEET_COLOR);
      closeModal();
    } catch (err) {
      console.error("Error creating fleet:", err);
    }
  };

  const handleClose = () => {
    reset();
    setColor(DEFAULT_FLEET_COLOR);
    closeModal();
  };

  return (
    <Modal id={MODAL_IDS.createFleet} animation="scale" closeOnOverlayClick={false}>
      <Modal.Overlay blurIntensity={4} opacity={0.72} backgroundColor="rgba(14, 10, 32, 0.7)" />
      <Modal.Content
        className="fleet-modal-fullscreen"
        maxWidth="100vw"
        width="100vw"
        padding="0"
        borderRadius="0"
        maxHeight="100vh"
        scrollable={false}
      >
        <div className="fleet-overlay-container">
          {/* Top Bar matching Figma */}
          <header className="fleet-overlay-header">
            <button type="button" className="overlay-back-btn" onClick={handleClose}>
              <span className="arrow">←</span>
              <span>{text.return}</span>
            </button>
            <button
              type="button"
              className={`overlay-help-btn ${showHelp ? "is-active" : ""}`}
              onClick={() => setShowHelp((v) => !v)}
            >
              <span>{text.help}</span>
              <InfoIcon className="w-4 h-4 ml-1.5 inline-block opacity-70" />
            </button>
          </header>

          {/* Help Panel */}
          {showHelp && (
            <div className="help-panel-figma">
              <div className="help-panel-inner">
                <h3>{help.title}</h3>
                <ul>
                  {help.items.map((item, i) => (
                    <li key={i}>
                      <span className="help-number">{i + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="help-close-btn"
                  onClick={() => setShowHelp(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Main Content Stage */}
          <div className="fleet-overlay-center">
            {/* Left Preview Section */}
            <PreviewCard values={values} color={color} locale={locale} />

            {/* Right Form Section */}
            <form className="fleet-form-figma" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-header-figma">
                <h1>{text.modalTitle}</h1>
                <p className="form-subtitle-figma">{text.modalSubtitle}</p>
              </div>

              <div className="form-body-figma">
                <div className="form-row-1-figma">
                  <div className="form-field-figma name-field-figma">
                    <label>
                      {text.name} <span>*</span>
                    </label>
                    <input
                      {...register("name")}
                      placeholder={text.namePlaceholder}
                      autoFocus
                      aria-invalid={errors.name ? "true" : "false"}
                    />
                    {errors.name && <small className="error-text-figma">{text.required}</small>}
                  </div>

                  <div className="form-field-figma color-field-figma">
                    <label>{text.color}</label>
                    <div className="color-options-row-figma">
                      {FLEET_COLORS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          aria-label={`Couleur ${item}`}
                          className={`color-swatch-dot-figma ${color === item ? "is-active" : ""}`}
                          style={{ backgroundColor: item }}
                          onClick={() => setColor(item)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-field-figma desc-field-figma">
                  <label>{text.description}</label>
                  <textarea
                    {...register("description")}
                    placeholder={text.descriptionPlaceholder}
                    rows={4}
                  />
                </div>
              </div>

              <div className="form-actions-figma">
                <button
                  type="button"
                  className="btn-cancel-figma"
                  onClick={handleClose}
                >
                  {text.cancel}
                </button>

                <button
                  type="submit"
                  className="btn-submit-figma"
                  disabled={!values.name?.trim() || isSubmitting || createMutation.isPending}
                >
                  {isSubmitting || createMutation.isPending ? text.loading : text.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
}

/** Main Fleets Page Component */
export function FleetsPage({ locale = "en" }: { locale?: Locale }) {
  const text = copy[locale];
  const { openModal } = useModalActions();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // TanStack Query Infinite Pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useFleetsQuery();

  // Flattened fleet list with fallback
  const fleets = useMemo(() => {
    if (data?.pages?.length) {
      const items = data.pages.flatMap((page) => page.items);
      if (items.length > 0) return items;
    }
    return isError ? FALLBACK_SEED_FLEETS : (isLoading ? [] : FALLBACK_SEED_FLEETS);
  }, [data, isError, isLoading]);

  // Infinite scroll intersection observer
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "360px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const [showPageHelp, setShowPageHelp] = useState(false);
  const pageHelp = helpTexts[locale];

  return (
    <main className="fleets-page">
      {/* Action Header */}
      <header className="fleets-header">
        <div className="fleets-header__actions">
          {/* Language Switcher Links */}
          <div className="lang-switcher">
            <Link
              href="/fr/fleets"
              className={`lang-link ${locale === "fr" ? "is-active" : ""}`}
            >
              FR
            </Link>
            <span className="lang-sep">|</span>
            <Link
              href="/en/fleets"
              className={`lang-link ${locale === "en" ? "is-active" : ""}`}
            >
              EN
            </Link>
          </div>

          <button
            className={`text-action ${showPageHelp ? "is-active" : ""}`}
            type="button"
            onClick={() => setShowPageHelp((v) => !v)}
          >
            <span>{text.help}</span>
            <InfoIcon className="w-4 h-4 ml-1.5 inline-block opacity-70" />
          </button>
        </div>

        {/* Page Help Panel */}
        {showPageHelp && (
          <div className="page-help-panel">
            <div className="help-panel-inner">
              <h3>{pageHelp.title}</h3>
              <ul>
                {pageHelp.items.map((item, i) => (
                  <li key={i}>
                    <span className="help-number">{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="help-close-btn"
                onClick={() => setShowPageHelp(false)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Fleets Main Content Area */}
      <section className="fleets-content">
        <div className="fleets-toolbar">
          <div>
            <p className="eyebrow">{text.directory}</p>
            <h1>{text.title}</h1>
          </div>
          <Button
            variant="primary"
            padding="lg"
            onClick={() => openModal(MODAL_IDS.createFleet)}
          >
            <SparkleIcon className="w-4 h-4 mr-1.5 inline-block" />
            {text.create}
          </Button>
        </div>

        {/* Fleet Card Grid */}
        {fleets.length > 0 ? (
          <div className="fleet-grid">
            {fleets.map((fleet) => (
              <FleetCard key={fleet.id} fleet={fleet} locale={locale} />
            ))}
          </div>
        ) : isLoading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>{text.loading}</p>
          </div>
        ) : (
          <p className="empty-state">{text.empty}</p>
        )}

        {/* Loading Indicator when fetching more pages */}
        {isFetchingNextPage && (
          <div className="loading-more">
            <div className="spinner-small" />
            <span>{text.loading}</span>
          </div>
        )}

        {/* Infinite Scroll Sentinel */}
        <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />
      </section>

      {/* Fleet Creation Modal */}
      <CreateFleetModal locale={locale} />
    </main>
  );
}
