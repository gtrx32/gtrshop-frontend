import 'vue-router'

type FooterMeta = {
  variant?: 'minimal'
}

declare module 'vue-router' {
  interface RouteMeta {
    footer?: FooterMeta
  }
}

declare module '#app' {
  interface PageMeta {
    footer?: FooterMeta
  }
}
