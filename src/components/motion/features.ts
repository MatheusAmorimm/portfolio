/**
 * Ponto de entrada isolado do subconjunto `domAnimation`, importado
 * dinamicamente pelo Reveal. Estando num módulo próprio, o bundler o
 * separa num chunk que só baixa quando uma seção com animação entra em
 * cena — em vez de somar ao JS inicial da página.
 */
export { domAnimation as default } from "motion/react";
