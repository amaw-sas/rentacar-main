# Plan: Implementación Blog alquilatucarro.com

> **Rama:** `feat/blog-implementation`
> **Fecha:** 2025-01-12
> **Estado:** Planificado
> **Tamaño:** L (15-20 archivos)

## Objetivo

Implementar un blog SEO-optimizado para captar tráfico informacional (top-of-funnel) y mejorar autoridad de dominio.

**Meta:** Posicionar artículos informativos que alimenten tráfico hacia páginas transaccionales de ciudades.

---

## Análisis Previo

### Estado Actual

| Aspecto | Estado | Ubicación |
|---------|--------|-----------|
| Página /blog | Placeholder "En construcción" | `app/pages/blog.vue` |
| Sistema contenido | No instalado | - |
| Patrón actual | Hardcoded | `app/app.config.ts` |
| SEO/Schemas | Infraestructura lista | `app/composables/use*SEO.ts` |
| Sitemap | `/blog` excluido | `nuxt.config.ts:155` |
| robots.txt | `/blog` no listado | `nuxt.config.ts:158-181` |

### Decisión Técnica

**Elegido:** `@nuxt/content` v3

**Razones:**
- Archivos Markdown versionados con Git
- Excelente SEO out-of-the-box (meta tags, OG, sitemap)
- Query builder para filtrar/ordenar contenido
- Syntax highlighting para code blocks
- Table of contents automático
- Compatible con Nuxt 4
- Sin infraestructura adicional (serverless-friendly)

---

## Arquitectura

### Estructura de Archivos

```
app/
├── content/
│   └── blog/
│       ├── requisitos-alquilar-carro-colombia.md
│       ├── que-hacer-bogota-carro-alquilado.md
│       └── mejores-rutas-cartagena.md
├── pages/
│   └── blog/
│       ├── index.vue          # Listado de artículos
│       └── [...slug].vue      # Detalle de artículo (catch-all)
├── components/
│   └── Blog/
│       ├── Card.vue           # Card para listado
│       ├── Hero.vue           # Hero del artículo
│       ├── Author.vue         # Byline con autor
│       ├── TableOfContents.vue # TOC lateral
│       ├── RelatedPosts.vue   # Posts relacionados
│       └── ShareButtons.vue   # Compartir en redes
├── composables/
│   ├── useBlogSEO.ts          # Meta tags para listado
│   └── useBlogPostSEO.ts      # Meta + BlogPosting schema
└── utils/
    └── types/
        └── BlogPost.ts        # Tipos TypeScript
```

### Schema del Contenido (Frontmatter)

```yaml
---
title: "Requisitos para Alquilar un Carro en Colombia 2025"
description: "Guía completa con todos los documentos y requisitos..."
image: /img/blog/requisitos-alquiler.webp
alt: Persona mostrando documentos para alquilar carro
author:
  name: Alquilatucarro
  avatar: /img/authors/alquilatucarro.webp
date: 2025-01-15
updated: 2025-01-15
category: guias
tags:
  - requisitos
  - documentos
  - colombia
readingTime: 8
featured: true
---
```

### Tipos TypeScript

```typescript
// app/utils/types/BlogPost.ts
export interface BlogAuthor {
  name: string;
  avatar: string;
}

export interface BlogPost {
  _path: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  author: BlogAuthor;
  date: string;
  updated?: string;
  category: 'guias' | 'destinos' | 'tips' | 'rutas';
  tags: string[];
  readingTime: number;
  featured?: boolean;
  body: any; // Parsed markdown content
}
```

---

## Implementación por Fases

### Fase 1: Infraestructura Técnica

**Tareas:**

- [ ] 1.1 Instalar `@nuxt/content` v3
- [ ] 1.2 Configurar módulo en `nuxt.config.ts`
- [ ] 1.3 Crear estructura de carpetas `content/blog/`
- [ ] 1.4 Definir tipos TypeScript `BlogPost.ts`
- [ ] 1.5 Crear página listado `/blog/index.vue`
- [ ] 1.6 Crear página detalle `/blog/[...slug].vue`
- [ ] 1.7 Actualizar sitemap para incluir blog
- [ ] 1.8 Actualizar robots.txt

**Archivos a crear/modificar:**

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `package.json` | Modificar | Agregar @nuxt/content |
| `nuxt.config.ts` | Modificar | Configurar módulo + sitemap |
| `app/content/blog/.gitkeep` | Crear | Placeholder para contenido |
| `app/utils/types/BlogPost.ts` | Crear | Tipos TypeScript |
| `app/pages/blog/index.vue` | Reemplazar | Listado de artículos |
| `app/pages/blog/[...slug].vue` | Crear | Detalle de artículo |

**Comandos:**

```bash
# Instalar dependencia
pnpm add @nuxt/content

# Verificar instalación
pnpm run build
```

---

### Fase 2: Componentes UI

**Tareas:**

- [ ] 2.1 Crear `BlogCard.vue` - Card para listado
- [ ] 2.2 Crear `BlogHero.vue` - Hero del artículo
- [ ] 2.3 Crear `BlogAuthor.vue` - Byline con autor y fecha
- [ ] 2.4 Crear `BlogTableOfContents.vue` - TOC lateral (desktop)
- [ ] 2.5 Crear `BlogRelatedPosts.vue` - Posts relacionados
- [ ] 2.6 Crear `BlogShareButtons.vue` - Compartir en redes (opcional)

**Archivos a crear:**

| Archivo | Descripción |
|---------|-------------|
| `app/components/Blog/Card.vue` | Grid card con imagen, título, excerpt, fecha |
| `app/components/Blog/Hero.vue` | Imagen hero + título + meta |
| `app/components/Blog/Author.vue` | Avatar + nombre + fecha + reading time |
| `app/components/Blog/TableOfContents.vue` | Links a headings (sticky sidebar) |
| `app/components/Blog/RelatedPosts.vue` | 2-3 posts de misma categoría |

**Diseño:**

- Consistente con estilo actual (dark theme, Tailwind)
- Cards con hover effect similar a testimonios
- Hero full-width con overlay para legibilidad
- Mobile-first responsive

---

### Fase 3: SEO y Schemas

**Tareas:**

- [ ] 3.1 Crear `useBlogSEO.ts` - Meta para listado
- [ ] 3.2 Crear `useBlogPostSEO.ts` - Meta + BlogPosting schema
- [ ] 3.3 Agregar BreadcrumbList para blog
- [ ] 3.4 Configurar Open Graph para compartir
- [ ] 3.5 Agregar canonical URLs

**Archivos a crear:**

| Archivo | Descripción |
|---------|-------------|
| `app/composables/useBlogSEO.ts` | Meta tags para /blog |
| `app/composables/useBlogPostSEO.ts` | BlogPosting schema + meta |

**BlogPosting Schema (JSON-LD):**

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Requisitos para Alquilar un Carro en Colombia",
  "description": "Guía completa...",
  "image": "https://alquilatucarro.com/img/blog/requisitos.webp",
  "author": {
    "@type": "Organization",
    "name": "Alquilatucarro",
    "url": "https://alquilatucarro.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Alquilatucarro",
    "logo": {
      "@type": "ImageObject",
      "url": "https://alquilatucarro.com/logo.png"
    }
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-15",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://alquilatucarro.com/blog/requisitos-alquilar-carro"
  }
}
```

---

### Fase 4: Contenido Inicial

**Artículos prioritarios (según estrategia SEO):**

| # | Título | Keyword Target | Palabras | Prioridad |
|---|--------|----------------|----------|-----------|
| 1 | Requisitos para Alquilar Carro en Colombia 2025 | requisitos alquilar carro colombia | 1500 | Alta |
| 2 | Qué Hacer en Bogotá con Carro Alquilado | que hacer bogota carro | 2000 | Alta |
| 3 | Qué Hacer en Medellín con Carro Alquilado | que hacer medellin carro | 2000 | Alta |
| 4 | Mejores Rutas desde Cartagena en Carro | rutas cartagena carro | 1500 | Media |
| 5 | Guía de Peajes en Colombia 2025 | peajes colombia | 1200 | Media |
| 6 | Pico y Placa en Bogotá, Medellín y Cali | pico y placa colombia | 1000 | Baja |

**Estructura de cada artículo:**

```markdown
# [Título con keyword]

[Párrafo intro con keyword en primeras 100 palabras]

## [H2 con keyword secundaria]

[Contenido útil, 200-300 palabras]

### [H3 si aplica]

## Preguntas Frecuentes

### ¿[Pregunta con keyword]?
[Respuesta concisa]

## Conclusión

[Resumen + CTA hacia página de ciudad]
```

---

### Fase 5: Integración y Testing

**Tareas:**

- [ ] 5.1 Verificar build exitoso
- [ ] 5.2 Probar navegación blog → artículo → ciudad
- [ ] 5.3 Validar schemas con Google Rich Results Test
- [ ] 5.4 Verificar meta tags con herramientas SEO
- [ ] 5.5 Test responsive (mobile/tablet/desktop)
- [ ] 5.6 Verificar sitemap incluye artículos
- [ ] 5.7 Probar compartir en redes (OG tags)

**Herramientas de validación:**

- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Validator](https://validator.schema.org/)
- [Meta Tags Debugger](https://metatags.io/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

## Configuración nuxt.config.ts

```typescript
// Agregar a modules
modules: [
  '@nuxtjs/seo',
  '@nuxt/ui',
  '@pinia/nuxt',
  'nuxt-llms',
  '@nuxt/content', // NUEVO
],

// Configuración de @nuxt/content
content: {
  // Habilitar highlighting para code blocks
  highlight: {
    theme: 'github-dark',
    langs: ['javascript', 'typescript', 'bash', 'json', 'yaml', 'markdown']
  },
  // Generar TOC automático
  markdown: {
    toc: {
      depth: 3,
      searchDepth: 3
    }
  }
},

// Actualizar sitemap
sitemap: {
  urls: [
    '/',
    // ... ciudades existentes
  ],
  // Remover '/blog' de exclude
  exclude: ['/pendiente', '/sindisponibilidad', '/reservado/**', '/**/buscar-vehiculos/**'],
  // @nuxt/content genera automáticamente URLs de blog
},

// Actualizar robots
robots: {
  allow: [
    '/',
    '/blog',
    '/blog/*',
    // ... ciudades existentes
  ],
},

// Agregar prerender de blog
nitro: {
  prerender: {
    routes: [
      '/',
      '/blog',
      // Las rutas de artículos se generan automáticamente
      // ... ciudades existentes
    ]
  }
}
```

---

## Checklist Final

### Pre-lanzamiento

- [ ] Build exitoso sin errores
- [ ] Mínimo 3 artículos publicados
- [ ] Schemas validados
- [ ] Meta tags correctos
- [ ] Imágenes optimizadas (WebP, <100KB)
- [ ] Responsive funcionando
- [ ] Links internos a ciudades
- [ ] Sitemap actualizado
- [ ] robots.txt actualizado

### Post-lanzamiento

- [ ] Indexación solicitada en GSC
- [ ] Monitorear rankings de keywords
- [ ] Agregar 1-2 artículos por semana
- [ ] Medir tráfico orgánico al blog
- [ ] A/B test de CTAs hacia ciudades

---

## Estimación de Tiempo

| Fase | Descripción | Estimación |
|------|-------------|------------|
| 1 | Infraestructura técnica | 2-3 horas |
| 2 | Componentes UI | 2-3 horas |
| 3 | SEO y Schemas | 1-2 horas |
| 4 | 3 artículos iniciales | 4-6 horas |
| 5 | Testing e integración | 1-2 horas |
| **Total** | | **10-16 horas** |

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Mitigación |
|--------|--------------|------------|
| @nuxt/content incompatible con Nuxt 4 | Baja | Verificar docs, usar v3 |
| Build lento con muchos artículos | Media | Usar prerender selectivo |
| Imágenes pesadas afectan LCP | Media | Usar WebP, lazy loading |
| Contenido duplicado con ciudades | Baja | Diferenciación clara, canonicals |

---

## Próximos Pasos

1. **Aprobar este plan**
2. **Ejecutar Fase 1** - Infraestructura técnica
3. **Ejecutar Fase 2** - Componentes UI
4. **Ejecutar Fase 3** - SEO y Schemas
5. **Escribir artículos** - Fase 4
6. **Testing y deploy** - Fase 5

---

## Referencias

- [Nuxt Content v3 Docs](https://content.nuxt.com/)
- [Schema.org BlogPosting](https://schema.org/BlogPosting)
- [Google Search Central - Blog](https://developers.google.com/search/docs/appearance/structured-data/article)
- [docs/seo/acciones/contenido.md](../seo/acciones/contenido.md) - Plan de contenido SEO
