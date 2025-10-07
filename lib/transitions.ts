/**
 * Transition Utilities for Email Builder
 *
 * This file contains utility classes and constants for consistent
 * transitions and animations across the application.
 */

/**
 * Recommended Tailwind CSS classes for common transitions
 */
export const transitionClasses = {
  /**
   * Hover state transitions for interactive elements
   * Smoothly animates border and shadow changes
   *
   * @example
   * ```tsx
   * <div className={transitionClasses.hoverBorder}>
   *   Content
   * </div>
   * ```
   */
  hoverBorder: "transition-[border-color,box-shadow] duration-200 ease-out",

  /**
   * Shadow transition for elevated elements
   * Use with hover:shadow-2xl for dramatic elevation effect
   *
   * @example
   * ```tsx
   * <div className={`${transitionClasses.shadow} hover:shadow-2xl`}>
   *   Content
   * </div>
   * ```
   */
  shadow: "transition-shadow duration-300 ease-out",

  /**
   * Combined border and shadow transition
   * Ideal for cards and interactive panels
   *
   * @example
   * ```tsx
   * <div className={`${transitionClasses.borderAndShadow} hover:border-primary hover:shadow-2xl`}>
   *   Content
   * </div>
   * ```
   */
  borderAndShadow: "transition-[border-color,box-shadow] duration-200 ease-out",

  /**
   * Smooth opacity fade for overlays and tooltips
   *
   * @example
   * ```tsx
   * <div className={transitionClasses.fade}>
   *   Content
   * </div>
   * ```
   */
  fade: "transition-opacity duration-200 ease-out",

  /**
   * Transform transition for scale and translate effects
   *
   * @example
   * ```tsx
   * <div className={`${transitionClasses.transform} hover:scale-105`}>
   *   Content
   * </div>
   * ```
   */
  transform: "transition-transform duration-200 ease-out",

  /**
   * All-purpose transition for multiple properties
   * Use when you need to animate multiple properties at once
   *
   * @example
   * ```tsx
   * <div className={transitionClasses.all}>
   *   Content
   * </div>
   * ```
   */
  all: "transition-all duration-200 ease-out",

  /**
   * Background color transition
   * Ideal for button hover states and interactive backgrounds
   *
   * @example
   * ```tsx
   * <button className={`${transitionClasses.background} hover:bg-primary`}>
   *   Click me
   * </button>
   * ```
   */
  background: "transition-colors duration-200 ease-out",
} as const;

/**
 * Animation duration constants (in milliseconds)
 * Use these for consistent timing across the application
 */
export const animationDuration = {
  instant: 0,
  fast: 150,
  normal: 200,
  medium: 300,
  slow: 500,
} as const;

/**
 * Easing functions for animations
 */
export const easingFunctions = {
  easeOut: "ease-out",
  easeIn: "ease-in",
  easeInOut: "ease-in-out",
  linear: "linear",
} as const;

/**
 * Common animation patterns as Tailwind classes
 */
export const animations = {
  /**
   * Fade in animation (using Tailwind's animate-in utilities)
   */
  fadeIn: "animate-in fade-in-0 duration-200",

  /**
   * Fade out animation
   */
  fadeOut: "animate-out fade-out-0 duration-200",

  /**
   * Slide in from bottom
   */
  slideInBottom: "animate-in slide-in-from-bottom-2 duration-200",

  /**
   * Slide in from top
   */
  slideInTop: "animate-in slide-in-from-top-2 duration-200",

  /**
   * Slide in from left
   */
  slideInLeft: "animate-in slide-in-from-left-2 duration-200",

  /**
   * Slide in from right
   */
  slideInRight: "animate-in slide-in-from-right-2 duration-200",

  /**
   * Zoom in (scale up from small)
   */
  zoomIn: "animate-in zoom-in-95 duration-200",

  /**
   * Zoom out (scale down)
   */
  zoomOut: "animate-out zoom-out-95 duration-200",
} as const;

/**
 * Helper function to combine transition classes
 *
 * @example
 * ```tsx
 * const classes = combineTransitions([
 *   transitionClasses.shadow,
 *   'hover:shadow-2xl',
 *   'rounded-lg'
 * ]);
 * ```
 */
export function combineTransitions(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}
