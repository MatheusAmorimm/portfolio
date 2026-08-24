import { evaluate } from "@mdx-js/mdx";
import type { MDXContent } from "mdx/types";
import * as devRuntime from "react/jsx-dev-runtime";
import * as prodRuntime from "react/jsx-runtime";

/**
 * Compila UMA fatia de idioma já separada pelo splitter. Roda no
 * servidor durante a build; o cliente recebe HTML pronto e nenhum
 * runtime de MDX — requisito da spec § 6.2.
 *
 * Em desenvolvimento o React usa jsxDEV; em produção, jsx/jsxs —
 * passar o runtime errado quebra a renderização.
 */
const runtime =
  process.env.NODE_ENV === "production"
    ? prodRuntime
    : { ...devRuntime, development: true };

export async function compileBody(source: string): Promise<MDXContent> {
  const { default: Body } = await evaluate(source, runtime);
  return Body;
}
