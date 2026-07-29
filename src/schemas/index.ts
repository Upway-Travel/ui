/**
 * @upway/ui/schemas — the render-contract schemas (design §4.5).
 *
 * Pure Zod, React-free. Both the renderer (frontend) and the tool-calling
 * layer (backend) import from here so the model and the interface share one
 * contract. The twelve widgets register their schemas as they are built.
 */

export * from './sourceReceipt';
