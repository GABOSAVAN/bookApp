// tailwind.config.js
export default {
    theme: {
      extend: {
        colors: {
          // La paleta 'gray' ahora tiene valores oscuros para el texto y claros para el fondo.
          gray: {
            '50': '#1C1C1E', // Un gris casi negro para el modo oscuro
            '100': '#2C2C2E',
            '200': '#3A3A3C',
            '300': '#48484A',
            '400': '#636366',
            '500': '#8E8E93',
            '600': '#98989E',
            '700': '#C7C7CC',
            '800': '#D1D1D6',
            '900': '#E5E5EA',
            '950': '#F2F2F7', // Un gris muy claro, ideal para fondos de modo claro
          },
          // 'primary' es el color de énfasis, un azul oscuro para contrastar con el fondo.
          primary: {
            '50': '#EBF5FF',
            '100': '#D1E4FF',
            '200': '#A2C9FF',
            '300': '#71A8FF',
            '400': '#4288FF',
            '500': '#006CFF', // Un azul vibrante
            '600': '#0054CC',
            '700': '#003A8A',
            '800': '#00255A',
            '900': '#001433',
            '950': '#000717',
          }
        }
      }
    }
  }