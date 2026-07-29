// Components
export { default as Button } from './components/Button';
export { default as Input } from './components/Input';
export { default as Select } from './components/Select';
export { default as Badge } from './components/Badge';
export { default as Card } from './components/Card';
export { default as ScoreRing } from './components/ScoreRing';
export { default as AnimatedCounter } from './components/AnimatedCounter';
export { default as Skeleton, SkeletonText, SkeletonCard } from './components/Skeleton';
export { default as SlidePanel, SlidePanelHeader } from './components/SlidePanel';
export { default as Toast, useToastStore, toast } from './components/Toast';
export { default as UpwayLogo, UpwayMark, UpwayIcon } from './components/UpwayLogo';
export { default as UpwayWordmark } from './components/UpwayWordmark';
export type { UpwayWordmarkProps, UpwayWordmarkVariant } from './components/UpwayWordmark';
export { default as FlapDisplay } from './components/FlapDisplay';
export type { FlapDisplayProps } from './components/FlapDisplay';
export { default as DepartureTicker } from './components/DepartureTicker';
export type { DepartureTickerProps, DepartureColumn } from './components/DepartureTicker';
export { FloatingNav } from './components/FloatingNav';
export type { FloatingNavProps, NavLink, FloatingNavVariant } from './components/FloatingNav';
export { default as FieldNoteCard } from './components/FieldNoteCard';
export type { FieldNoteCardProps } from './components/FieldNoteCard';
export { default as AppMockupFrame } from './components/AppMockupFrame';
export type { AppMockupFrameProps } from './components/AppMockupFrame';
export { default as EditorialCaption } from './components/EditorialCaption';
export type { EditorialCaptionProps } from './components/EditorialCaption';
export { default as RouteEconomicsRow } from './components/RouteEconomicsRow';
export type { RouteEconomicsRowProps } from './components/RouteEconomicsRow';
export { default as AuditTrailFooter } from './components/AuditTrailFooter';
export type { AuditTrailFooterProps } from './components/AuditTrailFooter';
export { default as ActionChip } from './components/ActionChip';
export type { ActionChipProps, ActionChipVariant, ActionChipMode } from './components/ActionChip';
export { default as DataCallout } from './components/DataCallout';
export type { DataCalloutProps } from './components/DataCallout';
export { default as RouteCard } from './components/RouteCard';
export type { RouteCardProps } from './components/RouteCard';
export { default as AdviserSnippet } from './components/AdviserSnippet';
export type { AdviserSnippetProps } from './components/AdviserSnippet';
export { default as DossierZone } from './components/DossierZone';
export type { DossierZoneProps } from './components/DossierZone';
export { default as AskUpway } from './components/AskUpway';
export type { AskUpwayProps } from './components/AskUpway';
export { default as Eyebrow } from './components/Eyebrow';
export type { EyebrowProps, EyebrowTone } from './components/Eyebrow';
export { default as VoltButton } from './components/VoltButton';
export type { VoltButtonProps } from './components/VoltButton';
export { default as GradientCanvas } from './components/GradientCanvas';
export type { GradientCanvasProps } from './components/GradientCanvas';

// ── Render-contract widgets (design §4) ──
// The agent returns structured artifacts; each widget speaks the shared
// vocabulary and implements the four states (loading/loaded/partial/failed).
export { default as SourceReceipt } from './components/widgets/SourceReceipt';
export type { SourceReceiptProps } from './components/widgets/SourceReceipt';
// Schemas are also exported from the React-free './schemas' entry point so
// the tool-calling layer can share the contract (§4.5).
export {
  SourceReceiptSchema,
  ProvenanceSourceSchema,
  ConfidenceLevelSchema,
  WidgetStateSchema,
} from './schemas/sourceReceipt';
export type {
  SourceReceiptData,
  ProvenanceSource,
  ConfidenceLevel,
  WidgetState,
} from './schemas/sourceReceipt';

// Utilities
export { cn } from './lib/utils';
export * from './lib/formatters';
export * from './lib/animations';
