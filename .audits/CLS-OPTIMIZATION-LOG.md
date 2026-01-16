# CLS Optimization Log - alquilatucarro.com

## Objetivo
Reducir CLS (Cumulative Layout Shift) a < 0.1 en mobile y desktop.

---

## Estado Actual (2026-01-16)

| Dispositivo | CLS Actual | Objetivo | Estado |
|-------------|------------|----------|--------|
| Mobile | 0.23 | < 0.1 | NO ALCANZADO |
| Desktop | 0.285 | < 0.1 | NO ALCANZADO |

---

## Historial de Mediciones PageSpeed

### Mobile
| Fecha | Performance | CLS | LCP | TBT | Notas |
|-------|-------------|-----|-----|-----|-------|
| 2026-01-16 ~10:59 | 78 | 0.201 | - | - | Antes del fix PR #49 |
| 2026-01-16 ~11:01 | 83 | 0.23 | 2.9s | 130ms | Después del fix PR #49 |
| 2026-01-16 (previo) | 88 | ~0.2 | - | - | Reportado por usuario (mejor resultado) |

**Nota importante**: Los scores de PageSpeed varían entre mediciones (±5-10 puntos). El rango observado para mobile es 78-88 Performance.

### Desktop
| Fecha | Performance | CLS | LCP | TBT | Notas |
|-------|-------------|-----|-----|-----|-------|
| 2026-01-16 ~11:05 | 48 | 0.285 | 0.8s | 2,680ms | TBT muy alto afecta score |

---

## Fixes Intentados

### PR #49 - Critical CSS para Nuxt UI PageHero (2026-01-16)
**Archivo modificado**: `nuxt.config.ts`

**Clases añadidas al critical CSS**:
```css
/* Nuxt UI PageHero slot margins */
.mt-10 { margin-top: 2.5rem; }
.mb-4 { margin-bottom: 1rem; }

/* Nuxt UI PageHero typography */
.text-5xl { font-size: 3rem; line-height: 1; }
.tracking-tight { letter-spacing: -0.025em; }
.font-bold { font-weight: 700; }
.text-pretty { text-wrap: pretty; }
.text-center { text-align: center; }
.justify-center { justify-content: center; }
.flex-row { flex-direction: row; }
.space-x-0\.5 > :not(:last-child) { margin-right: 0.125rem; }

/* Responsive */
@media (min-width: 640px) {
  .sm\:text-7xl { font-size: 4.5rem; line-height: 1; }
}
```

**Resultado**:
- Performance mobile: +5 puntos (78 → 83)
- CLS: SIN MEJORA SIGNIFICATIVA (0.201 → 0.23, varianza normal)

**Conclusión**: El fix mejoró performance pero NO resolvió CLS. Las clases añadidas no eran la causa principal del layout shift.

---

## Fixes Previos (de sesiones anteriores)

### PR #48 - Critical CSS con innerHTML
- Cambio de método de inyección de CSS crítico
- Impacto en CLS: No documentado

### PR #47 - Critical CSS con clases de Nuxt UI grid
- Añadidas clases de grid
- Impacto en CLS: No documentado

### PR #46 - Redirect www a non-www canonical
- SEO fix, no relacionado con CLS

### PR #45 - Aspect-ratio container para hero image
- Añadido contenedor con aspect-ratio para reservar espacio
- **Este debería haber ayudado con CLS pero aparentemente no fue suficiente**

### PR #44 - CLS star icons, duplicate H1, ALQUILERDE FOUC
- Múltiples fixes de CLS
- Impacto parcial

---

## Análisis de Causa Raíz

### Elementos con aspect-ratio ya implementados (index.vue)
1. Hero image: `aspect-[100/81]` ✅
2. Video section image: `aspect-[100/81]` ✅
3. Persona section image: `aspect-[100/81]` ✅
4. Category images: `aspect-[8/3]` ✅
5. Testimonial avatars: `min-h-[48px]` ✅

### Posibles causas NO resueltas
1. **Fuentes web** - ¿Están causando FOIT/FOUT?
2. **Nuxt UI componentes** - Estilos aplicados después de hydration
3. **SelectBranch dropdown** - ¿Cambia de tamaño al cargar?
4. **LazyUModal** - ¿Reserva espacio correctamente?
5. **LazyUAccordion** - ¿Layout shift al cargar?
6. **nuxt-vitalizer** - Defer de stylesheet puede causar FOUC si critical CSS incompleto

### Lo que falta investigar
1. [ ] Usar Chrome DevTools Performance con "Layout Shift Regions"
2. [ ] Identificar elementos exactos que causan shift
3. [ ] Verificar font-display: swap en fuentes
4. [ ] Revisar si SelectBranch tiene dimensiones fijas
5. [ ] Verificar hydration de componentes Lazy

---

## Próximas Acciones a Intentar

### Prioridad 1 - Diagnóstico
- [ ] Grabar Performance trace en Chrome DevTools
- [ ] Identificar los 3-5 elementos principales causando CLS
- [ ] Documentar findings aquí

### Prioridad 2 - Fixes potenciales
- [ ] Añadir `font-display: swap` si no está
- [ ] Precargar fuentes críticas
- [ ] Revisar si nuxt-vitalizer necesita más clases en critical CSS
- [ ] Verificar dimensiones fijas en SelectBranch
- [ ] Considerar deshabilitar nuxt-vitalizer temporalmente para comparar

### NO repetir
- Añadir más clases de margin/padding al critical CSS (ya probado, no resuelve)
- Asumir que el score de PageSpeed mejoró sin comparar múltiples mediciones

---

## Configuración Actual Relevante

### nuxt-vitalizer (nuxt.config.ts)
```typescript
vitalizer: {
  disableStylesheets: 'entry',
  disablePrefetchLinks: true,
}
```

### Critical CSS location
`nuxt.config.ts` → `app.head.style` array

---

## Notas
- PageSpeed Insights tiene variabilidad de ±5-10 puntos entre mediciones
- Siempre tomar 2-3 mediciones para confirmar tendencia
- Mobile es prioridad (Google usa mobile-first indexing)
- Desktop tiene problema adicional de TBT alto (2,680ms) que es issue separado de CLS
