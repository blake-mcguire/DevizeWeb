/**
 * The video on /a/<token>, between the question and the form.
 *
 * `src` is null until the video exists. While it is null the page shows a
 * labelled empty frame on local and preview builds (so the layout can be
 * reviewed) and leaves the section out of a production build.
 *
 * Two ways to supply it:
 *   file   an .mp4 on the Blob store or in /public, played by the browser's own
 *          player. Give it a `poster` (a still from the video) so the frame is
 *          not black before it plays.
 *   embed  a player URL from YouTube, Vimeo, Loom or Wistia: the embed URL, not
 *          the watch page (https://www.youtube.com/embed/<id>,
 *          https://player.vimeo.com/video/<id>, https://www.loom.com/embed/<id>).
 *
 * A trade can have its own video; anything not set falls back to `all`.
 */

export type Vsl = {
  src: string | null;
  kind: "file" | "embed";
  /** A still shown before a file plays. Ignored for embeds (the host draws its own). */
  poster: string | null;
  /** A WebVTT captions file for a file video. Embeds carry their own captions. */
  captions: string | null;
  /** Width / height of the video as recorded. "16/9" for landscape, "9/16" for a phone held upright. */
  aspect: "16/9" | "4/5" | "9/16";
  /** What a screen reader hears for the player. */
  title: string;
};

const all: Vsl = {
  src: null,
  kind: "file",
  poster: null,
  captions: null,
  aspect: "16/9",
  title: "A short video from Blake McGuire at Devize about your Google map",
};

const byTrade: Partial<Record<"dental" | "hvac", Partial<Vsl>>> = {};

export function vslFor(trade: "dental" | "hvac"): Vsl {
  return { ...all, ...byTrade[trade] };
}
