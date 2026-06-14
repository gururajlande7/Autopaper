declare module 'katex/contrib/auto-render' {
  type Delimiter = {
    left: string
    right: string
    display: boolean
  }

  type RenderMathOptions = {
    delimiters?: Delimiter[]
    throwOnError?: boolean
    strict?: boolean | string
    trust?: boolean
  }

  export default function renderMathInElement(
    element: HTMLElement,
    options?: RenderMathOptions,
  ): void
}
