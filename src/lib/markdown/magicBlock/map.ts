import type { ComponentType } from 'svelte';
import ImageGallery from './imageGallery.svelte';

export function mapTagToComponent(tag: string): ComponentType|null {
  switch (String(tag)) {
    case 'imageGallery':
      return ImageGallery;
    default:
      return null;
  }
}