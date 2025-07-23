
module.exports = {
  plugins: [
    require('flowbite/plugin')

  ],
  darkMode: 'class', // Enables class-based dark mode
  content: ["./src/**/*.{js,jsx,ts,tsx}", "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}", "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      boxShadow: {
        custom: '0px 2px 6px 0px rgba(32, 32, 32, 0.15)',
      },
      textColor: ['visited'],
      fontFamily: {
        inter: ['Inter', 'sans'],
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },

      backgroundImage: {
        "neo-gradient": "linear-gradient(105deg, #0851DF 3.1%, #008FFE 98.78%)",
        "btn-prime-bg": "linear-gradient(160deg, #0851DF 0%, #008FFE 100%)",
        "btn-prime-hover": "linear-gradient(133.15deg, #0C5EE0 3.02%, #0253FC 100%)",
        "btn-prime-active": "linear-gradient(135deg, #0A50BF 0%, #0253FC 100%)",
        "dark": '#000000',
        "light": "#F4F4F4",
      },
      colors: {

        primary: {
          bg: '#FFFFFF',
          text: '#161616',
          icon: '#262626',
          divider: "#E0E0E0",
          border: "#0F6FFF",
          lable: "#000000",


        },
        secondary: {
          bg: '#F4F4F4',
          text: '#525252',
          icon: '#525252',
          divider: "#6F6F6F",
          btn: {
            default: "#FFFFFF",
            border: "#E0E0E0",
            hover: "#E5E5E5",
            active: "#C6C6C6"
          }
        },
        danger: {
          tertiary: {
            bg: '#DA1E28',
            text: "#FFFFFF",
            btn: {
              default: "#DA1E28",
              border: "#DA1E28",
              hover: "#BE1B22",
              active: "#A2171D"
            }
          }
        },
        tertiary: {
          bg: '#E0E0E0',
          text: '#A8A8A8'
        },
        overLay: {
          bg: "rgba(22, 22, 22, 0.5)"
        },
        error: {
          text: '#DA1E28'
        },
        interact: {
          ui: {
            default01: "#FFFFFF",
            deafult02: "#F4F4F4",
            hover: "#E5E5E5",
            active: "#E0E0E0"
          },

          accent: {
            default: "#0F6FFF",
            hover: "#0C5EE0",
            active: "#0A50BF"
          }
        },
        focus: {
          01: "#0F6FFF",
          02: "#FFFFFF"
        },
        support: {
          01: "#DA1E28",
          03: "#76A43D",
          05: "#FF5722"
        },
        disabled: {
          01: "#FFFFFF",
          02: "#c6c6c6"
        },
        field: {
          01: "#FFFFFF",
          02: "#F4F4F4"
        },
        warning: '#f57922',
        success: '#24a148',
        info: '#f1c21b',






        // new colors 

        Brand:
        {
          'color-brand-blue_light': '#008ffe',
          'color-brand-blue_dark': '#0851df'
        },
        Defaults:
        {
          'color-default-black': '#111111',
          'color-default-white': '#fcfcfc'
        },
        Gray:
        {
          'color-gray-1000': '#202020',
          'color-gray-950': '#646464',
          'color-gray-900': '#838383',
          'color-gray-800': '#8d8d8d',
          'color-gray-700': '#bbbbbb',
          'color-gray-600': '#cecece',
          'color-gray-500': '#d9d9d9',
          'color-gray-400': '#e0e0e0',
          'color-gray-300': '#e8e8e8',
          'color-gray-200': '#f0f0f0',
          'color-gray-100': '#f9f9f9',
          'color-gray-50': '#fcfcfc',
          'color-gray-dark-1000': '#eeeeee',
          'color-gray-dark-950': '#b4b4b4',
          'color-gray-dark-900': '#7b7b7b',
          'color-gray-dark-800': '#6e6e6e',
          'color-gray-dark-700': '#606060',
          'color-gray-dark-600': '#484848',
          'color-gray-dark-500': '#3a3a3a',
          'color-gray-dark-400': '#313131',
          'color-gray-dark-300': '#2a2a2a',
          'color-gray-dark-200': '#222222',
          'color-gray-dark-100': '#191919',
          'color-gray-dark-50': '#111111'
        },
        Background:
        {
          'bg-tertiary': '#f0f0f0',
          'bg-secondary': '#f9f9f9',
          'bg-primary': '#fcfcfc',
          'bg-tertiary-dark': '#222222',
          'bg-secondary-dark': '#111111',
          'bg-primary-dark': '#191919'
        },
        Overlay: { 'overlay-base': '#202020', 'overlay-base-dark': '#2d2d2d' },
        Border:
        {
          'border-100': '#cecece',
          'border-50': '#e8e8e8',
          'border-dark-100': '#3a3a3a',
          'border-dark-50': '#2a2a2a'
        },
        Text:
        {
          'text-disabled': '#bbbbbb',
          'text-alt': '#fcfcfc',
          'text-success': '#2b9a66',
          'text-error': '#dc3e42',
          'text-tertiary': '#8d8d8d',
          'text-secondary': '#646464',
          'text-primary': '#202020',
          'text-disabled-dark': '#606060',
          'text-alt-dark': '#eeeeee',
          'text-success-dark': '#33b074',
          'text-error-dark': '#e5484d',
          'text-tertiary-dark': '#6e6e6e',
          'text-secondary-dark': '#b4b4b4',
          'text-primary-dark': '#eeeeee'
        },
        Icon:
        {
          'icon-disabled': '#bbbbbb',
          'icon-alt': '#fcfcfc',
          'icon-success': '#2b9a66',
          'icon-error': '#dc3e42',
          'icon-tertiary': '#8d8d8d',
          'icon-secondary': '#646464',
          'icon-primary': '#202020',
          'icon-disabled-dark': '#606060',
          'icon-alt-dark': '#eeeeee',
          'icon-success-dark': '#33b074',
          'icon-error-dark': '#e5484d',
          'icon-tertiary-dark': '#6e6e6e',
          'icon-secondary-dark': '#b4b4b4',
          'icon-primary-dark': '#eeeeee'
        },
        Primary_Button:
        {
          'primary-button-disable': '#c2e5ff',
          'primary-button-loading': '#8ec8f6',
          'primary-button-active': '#0d74ce',
          'primary-button-hover': '#0588f0',
          'primary-button-text': '#fcfcfc',
          'primary-button-disable-dark': '#70b8ff',
          'primary-button-loading-dark': '#205d9e',
          'primary-button-active-dark': '#004074',
          'primary-button-hover-dark': '#3b9eff',
          'primary-button-text-dark': '#eeeeee'
        },
      
        Tertiary_Button:
        {
          'tertiary-button-disable': '#c2e5ff',
          'tertiary-button-loading': '#8ec8f6',
          'tertiary-button-active': '#0d74ce',
          'tertiary-button-hover': '#e6f4fe',
          'tertiary-button-default': '#0090ff',
          'tertiary-button-text': '#0090ff',
          'tertiary-button-disable-dark': '#003362',
          'tertiary-button-loading-dark': '#104d87',
          'tertiary-button-active-dark': '#0d2847',
          'tertiary-button-hover-dark': '#0d2847',
          'tertiary-button-default-dark': '#0090ff',
          'tertiary-button-text-dark': '#0090ff'
        },
        Danger_Button:
        {
          'danger-button-disable': '#ffdbdc',
          'danger-button-loading': '#f4a9aa',
          'danger-button-active': '#641723',
          'danger-button-hover': '#dc3e42',
          'danger-button-default': '#ce2c31',
          'danger-button-text': '#fcfcfc',
          'danger-button-disable-dark': '#ff9592',
          'danger-button-loading-dark': '#b54548',
          'danger-button-active-dark': '#72232d',
          'danger-button-hover-dark': '#dc3e42',
          'danger-button-default-dark': '#ce2c31',
          'danger-button-text-dark': '#eeeeee'
        },
        Link:
        {
          'link-disable': '#c2e5ff',
          'link-visited': '#654dc4',
          'link-loading': '#8ec8f6',
          'link-active': '#0d74ce',
          'link-hover': '#0588f0',
          'link-default': '#0090ff',
          'link-disable-dark': '#70b8ff',
          'link-visited-dark': '#6e56cf',
          'link-loading-dark': '#205d9e',
          'link-active-dark': '#004074',
          'link-hover-dark': '#3b9eff',
          'link-default-dark': '#0090ff'
        },
        Field:
        {
          'field-disable': '#f0f0f0',
          'field-loading': '#e0e0e0',
          'field-active': '#e0e0e0',
          'field-hover': '#f0f0f0',
          'field-default': '#fcfcfc',
          'field-disable-dark': '#2a2a2a',
          'field-loading-dark': '#313131',
          'field-active-dark': '#313131',
          'field-hover-dark': '#222222',
          'field-default-dark': '#191919'
        },
        Focus:
        {
          'focus-alt': '#fcfcfc',
          'focus-primary': '#0090ff',
          'focus-alt-dark': '#eeeeee',
          'focus-primary-dark': '#70b8ff'
        },
        Success:
        {
          'success-text-alt': '#e6f6eb',
          'success-base-alt': '#30a46c',
          'success-text': '#2b9a66',
          'success-base': '#adddc0' ,
          'success-text-alt-dark': '#FCFCFC',
          'success-base-alt-dark': '#30A46C',
          'success-text-dark': '#FCFCFC',
          'success-base-dark': '#28684A'
        },
        Error:
        {
          'error-text-alt': '#fff7f7',
          'error-base-alt': '#ce2c31',
          'error-text': '#ce2c31',
          'error-base': '#ffcdce',
          'error-text-alt-dark': '#500f1c',
          'error-base-alt-dark': '#e5484d',
          'error-text-dark': '#ffd1d9',
          'error-base-dark': '#72232d'
        },
        Warning01:
        {
          'warning-01-text-alt': '#fefbe9',
          'warning-01-base-alt': '#ffc53d',
          'warning-01-text': '#ab6400',
          'warning-01-base': '#ffee9c',
          'warning-01-text-alt-dark': '#5c3d05',
          'warning-01-base-alt-dark': '#ffc53d',
          'warning-01-text-dark': '#ffc53d',
          'warning-01-base-dark': '#714F19'
        },
        Warning02:
        {
          'warning-02-text-alt': '#ffefd6',
          'warning-02-base-alt': '#ef5f00',
          'warning-02-text': '#ef5f00',
          'warning-02-base': '#ffdfb5',
          'warning-02-text-alt-dark': '#66350c',
          'warning-02-base-alt-dark': '#ff801f',
          'warning-02-text-dark': '#ffa057',
          'warning-02-base-dark': '#66350c'
        },
        Info:
        {
          'info-text-alt': '#f4faff',
          'info-base-alt': '#0090ff',
          'info-text': '#0090ff',
          'info-base': '#c2e5ff',
          'info-text-alt-dark': '#0d2847',
          'info-base-alt-dark': '#0090ff',
          'info-text-dark': '#c2e6ff',
          'info-base-dark': '#205d9e'
        },
        Neutral:
        {
          'neutral-text-alt': '#202020',
          'neutral-base-alt': '#d9d9d9',
          'neutral-text': '#202020',
          'neutral-base': '#f0f0f0',
          'neutral-text-alt-dark': '#EEEEEE',
          'neutral-base-alt-dark': '#3A3A3A',
          'neutral-text-dark': '#EEEEEE',   // NEED TO DISCUSS
          'neutral-base-dark': '#2A2A2A'
        },
        Primary_Interaction:
        {
          'primary-disable': '#c2e5ff',
          'primary-loading': '#8ec8f6',
          'primary-active': '#0d74ce',
          'primary-hover': '#0588f0',
          'primary-default': '#0090ff',
          'primary-disable-dark': '#70b8ff',
          'primary-loading-dark': '#205d9e',
          'primary-active-dark': '#004074',
          'primary-hover-dark': '#3b9eff',
          'primary-default-dark': '#0090ff'
        },
        Secondary_Interaction:
        {
          'secondary-disable': '#f0f0f0',
          'secondary-loading': '#e0e0e0',
          'secondary-active': '#e0e0e0',
          'secondary-hover': '#f0f0f0',
          'secondary-default': '#fcfcfc',
          'secondary-disable-dark': '#2a2a2a',
          'secondary-loading-dark': '#313131',
          'secondary-active-dark': '#313131',
          'secondary-hover-dark': '#222222',
          'secondary-default-dark': '#191919'
        },
        Negative_Interaction:
        {
          'negative-disable': '#ffdbdc',
          'negative-loading': '#f4a9aa',
          'negative-active': '#641723',
          'negative-hover': '#dc3e42',
          'negative-default': '#ce2c31'
        },
        Surface:
        {
          'surface-disable': '#f0f0f0',
          'surface-loading': '#e0e0e0',
          'surface-active': '#e0e0e0',
          'surface-hover': '#f0f0f0',
          'surface-default-100': '#f0f0f0',
          'surface-default-50': '#fcfcfc',
          'surface-disable-dark': '#3a3a3a',
          'surface-loading-dark': '#313131',
          'surface-active-dark': '#313131',
          'surface-hover-dark': '#2a2a2a',
          'surface-default-100-dark': '#191919',
          'surface-default-50-dark': '#222222'
        },
        Secondary_Button:
        {
          'secondary-button-disable': '#f0f0f0',
          'secondary-button-loading': '#e0e0e0',
          'secondary-button-active': '#e0e0e0',
          'secondary-button-hover': '#f0f0f0',
          'secondary-button-default': '#fcfcfc',
          'secondary-button-text': '#646464',
          'secondary-button-disable-dark': '#2a2a2a',
          'secondary-button-loading-dark': '#313131',
          'secondary-button-active-dark': '#222222',
          'secondary-button-hover-dark': '#313131',
          'secondary-button-default-dark': '#222222',
          'secondary-button-text-dark': '#b4b4b4'
        },
        Sucess:
        {
          'success-text-alt-dark': '#ffffff',
          'success-base-alt-dark': '#30a46c',
          'success-text-dark': '#ffffff',
          "success-text": "#2b9a66",
          "success-base": "#adddc0",
          'success-base-dark': '#28684a'
        },
        Negative_interaction:
        {
          'negative-disable-dark': '#ffd1d9',
          'negative-loading-dark': '#b54548',
          'negative-active-dark': '#72232d',
          'negative-hover-dark': '#dc3e42',
          'negative-default-dark': '#ce2c31'
        },
        Sky:
        {
          'color-sky-950': '#1d3e56',
          'color-sky-900': '#00749e',
          'color-sky-800': '#74daf8',
          'color-sky-700': '#7ce2fe',
          'color-sky-600': '#60b3d7',
          'color-sky-500': '#8dcae3',
          'color-sky-400': '#a9daed',
          'color-sky-300': '#bee7f5',
          'color-sky-200': '#d1f0fa',
          'color-sky-100': '#e1f6fd',
          'color-sky-50': '#f1fafd'
        },
        Cyan:
        {
          'color-cyan-950': '#0d3c48',
          'color-cyan-900': '#107d98',
          'color-cyan-800': '#0797b9',
          'color-cyan-700': '#00a2c7',
          'color-cyan-600': '#3db9cf',
          'color-cyan-500': '#7dcedc',
          'color-cyan-400': '#9ddde7',
          'color-cyan-300': '#b5e9f0',
          'color-cyan-200': '#caf1f6',
          'color-cyan-100': '#def7f9',
          'color-cyan-50': '#f2fafb'
        },
        Teal:
        {
          'color-teal-950': '#0d3d38',
          'color-teal-900': '#008573',
          'color-teal-800': '#0d9b8a',
          'color-teal-700': '#12a594',
          'color-teal-600': '#53b9ab',
          'color-teal-500': '#83cdc1',
          'color-teal-400': '#a1ded2',
          'color-teal-300': '#b8eae0',
          'color-teal-200': '#ccf3ea',
          'color-teal-100': '#e0f8f3',
          'color-teal-50': '#f3fbf9'
        },
        Mint:
        {
          'color-mint-950': '#16433c',
          'color-mint-900': '#027864',
          'color-mint-800': '#7de0cb',
          'color-mint-700': '#86ead4',
          'color-mint-600': '#4cbba5',
          'color-mint-500': '#7ecfbd',
          'color-mint-400': '#9ce0d0',
          'color-mint-300': '#b3ecde',
          'color-mint-200': '#c8f4e9',
          'color-mint-100': '#ddf9f2',
          'color-mint-50': '#f2fbf9'
        },
        Jade:
        {
          'color-jade-950': '#1d3b31',
          'color-jade-900': '#208368',
          'color-jade-800': '#26997b',
          'color-jade-700': '#29a383',
          'color-jade-600': '#56ba9f',
          'color-jade-500': '#8bceb6',
          'color-jade-400': '#acdec8',
          'color-jade-300': '#c3e9d7',
          'color-jade-200': '#d6f1e3',
          'color-jade-100': '#e6f7ed',
          'color-jade-50': '#f4fbf7'
        },
        Green:
        {
          'color-green-950': '#193b2d',
          'color-green-900': '#218358',
          'color-green-800': '#2b9a66',
          'color-green-700': '#30a46c',
          'color-green-600': '#5bb98b',
          'color-green-500': '#8eceaa',
          'color-green-400': '#adddc0',
          'color-green-300': '#c4e8d1',
          'color-green-200': '#d6f1df',
          'color-green-100': '#e6f6eb',
          'color-green-50': '#f4fbf6'
        },
        Grass:
        {
          'color-grass-950': '#203c25',
          'color-grass-900': '#2a7e3b',
          'color-grass-800': '#3e9b4f',
          'color-grass-700': '#46a758',
          'color-grass-600': '#65ba74',
          'color-grass-500': '#94ce9a',
          'color-grass-400': '#b2ddb5',
          'color-grass-300': '#c9e8ca',
          'color-grass-200': '#daf1db',
          'color-grass-100': '#e9f6e9',
          'color-grass-50': '#f5fbf5'
        },
        Lime:
        {
          'color-lime-950': '#37401c',
          'color-lime-900': '#5c7c2f',
          'color-lime-800': '#b0e64c',
          'color-lime-700': '#bdee63',
          'color-lime-600': '#8db654',
          'color-lime-500': '#abc978',
          'color-lime-400': '#c2da91',
          'color-lime-300': '#d3e7a6',
          'color-lime-200': '#e2f0bd',
          'color-lime-100': '#eef6d6',
          'color-lime-50': '#f8faf3'
        },
        Yellow:
        {
          'color-yellow-950': '#473b1f',
          'color-yellow-900': '#9e6c00',
          'color-yellow-800': '#ffdc00',
          'color-yellow-700': '#ffe629',
          'color-yellow-600': '#d5ae39',
          'color-yellow-500': '#e4c767',
          'color-yellow-400': '#f3d768',
          'color-yellow-300': '#ffe770',
          'color-yellow-200': '#fff394',
          'color-yellow-100': '#fffab8',
          'color-yellow-50': '#fefce9'
        },
        Amber:
        {
          'color-amber-950': '#4f3422',
          'color-amber-900': '#ab6400',
          'color-amber-800': '#ffba18',
          'color-amber-700': '#ffc53d',
          'color-amber-600': '#e2a336',
          'color-amber-500': '#e9c162',
          'color-amber-400': '#f3d673',
          'color-amber-300': '#fbe577',
          'color-amber-200': '#ffee9c',
          'color-amber-100': '#fff7c2',
          'color-amber-50': '#fefbe9'
        },
        Orange:
        {
          'color-orange-950': '#582d1d',
          'color-orange-900': '#cc4e00',
          'color-orange-800': '#ef5f00',
          'color-orange-700': '#f76b15',
          'color-orange-600': '#ec9455',
          'color-orange-500': '#f5ae73',
          'color-orange-400': '#ffc182',
          'color-orange-300': '#ffd19a',
          'color-orange-200': '#ffdfb5',
          'color-orange-100': '#ffefd6',
          'color-orange-50': '#fff7ed'
        },
        Red:
        {
          'color-red-950': '#641723',
          'color-red-900': '#ce2c31',
          'color-red-800': '#dc3e42',
          'color-red-700': '#e5484d',
          'color-red-600': '#eb8e90',
          'color-red-500': '#f4a9aa',
          'color-red-400': '#fdbdbe',
          'color-red-300': '#ffcdce',
          'color-red-200': '#ffdbdc',
          'color-red-100': '#feebec',
          'color-red-50': '#fff7f7'
        },
        Warning_Red:
        {
          'color-warning_red-950': '#5c271f',
          'color-warning_red-900': '#d13415',
          'color-warning_red-800': '#dd4425',
          'color-warning_red-700': '#e54d2e',
          'color-warning_red-600': '#ec8e7b',
          'color-warning_red-500': '#f5a898',
          'color-warning_red-400': '#fdbdaf',
          'color-warning_red-300': '#ffcdc2',
          'color-warning_red-200': '#ffdcd3',
          'color-warning_red-100': '#feebe7',
          'color-warning_red-50': '#fff8f7'
        },
        Ruby:
        {
          'color-ruby-950': '#64172b',
          'color-ruby-900': '#ca244d',
          'color-ruby-800': '#dc3b5d',
          'color-ruby-700': '#e54666',
          'color-ruby-600': '#e592a3',
          'color-ruby-500': '#efacb8',
          'color-ruby-400': '#f8bfc8',
          'color-ruby-300': '#ffced6',
          'color-ruby-200': '#ffdce1',
          'color-ruby-100': '#feeff3',
          'color-ruby-50': '#fff7f9'
        },
        Crimson:
        {
          'color-crimson-950': '#621639',
          'color-crimson-900': '#cb1d63',
          'color-crimson-800': '#df3478',
          'color-crimson-700': '#e93d82',
          'color-crimson-600': '#e093b2',
          'color-crimson-500': '#eaacc3',
          'color-crimson-400': '#f3bed1',
          'color-crimson-300': '#facedd',
          'color-crimson-200': '#fedce7',
          'color-crimson-100': '#ffe9f0',
          'color-crimson-50': '#fef7f9'
        },
        Pink:
        {
          'color-pink-950': '#651249',
          'color-pink-900': '#c2298a',
          'color-pink-800': '#cf3897',
          'color-pink-700': '#d6409f',
          'color-pink-600': '#dd93c2',
          'color-pink-500': '#e7acd0',
          'color-pink-400': '#efbfdd',
          'color-pink-300': '#f6cee7',
          'color-pink-200': '#fbdcef',
          'color-pink-100': '#fee9f5',
          'color-pink-50': '#fef7fb'
        },
        Purple:
        {
          'color-purple-950': '#402060',
          'color-purple-900': '#8145b5',
          'color-purple-800': '#8347b9',
          'color-purple-700': '#8e4ec6',
          'color-purple-600': '#be93e4',
          'color-purple-500': '#d1afec',
          'color-purple-400': '#e0c4f4',
          'color-purple-300': '#ead5f9',
          'color-purple-200': '#f2e2fc',
          'color-purple-100': '#f7edfe',
          'color-purple-50': '#fbf7fe'
        },
        Violet:
        {
          'color-violet-950': '#2f265f',
          'color-violet-900': '#6550b9',
          'color-violet-800': '#654dc4',
          'color-violet-700': '#6e56cf',
          'color-violet-600': '#aa99ec',
          'color-violet-500': '#c2b5f5',
          'color-violet-400': '#d4cafe',
          'color-violet-300': '#e1d9ff',
          'color-violet-200': '#ebe4ff',
          'color-violet-100': '#f4f0fe',
          'color-violet-50': '#faf8ff'
        },
        Iris:
        {
          'color-iris-950': '#272962',
          'color-iris-900': '#5753c6',
          'color-iris-800': '#5151cd',
          'color-iris-700': '#5b5bd6',
          'color-iris-600': '#9b9ef0',
          'color-iris-500': '#b8baf8',
          'color-iris-400': '#cbcdff',
          'color-iris-300': '#dadcff',
          'color-iris-200': '#e6e7ff',
          'color-iris-100': '#f0f1fe',
          'color-iris-50': '#f8f8ff'
        },
        Blue:
        {
          'color-blue-950': '#113264',
          'color-blue-900': '#0d74ce',
          'color-blue-800': '#0588f0',
          'color-blue-700': '#0090ff',
          'color-blue-600': '#5eb1ef',
          'color-blue-500': '#8ec8f6',
          'color-blue-400': '#acd8fc',
          'color-blue-300': '#c2e5ff',
          'color-blue-200': '#d5efff',
          'color-blue-100': '#e6f4fe',
          'color-blue-50': '#f4faff'
        },
        Indigo:
        {
          'color-indigo-950': '#1f2d5c',
          'color-indigo-900': '#3a5bc7',
          'color-indigo-800': '#3358d4',
          'color-indigo-700': '#3e63dd',
          'color-indigo-600': '#8da4ef',
          'color-indigo-500': '#abbdf9',
          'color-indigo-400': '#c1d0ff',
          'color-indigo-300': '#d2deff',
          'color-indigo-200': '#e1e9ff',
          'color-indigo-100': '#edf2fe',
          'color-indigo-50': '#f7f9ff'
        },
        Gold:
        {
          'color-gold-950': '#3b352b',
          'color-gold-900': '#71624b',
          'color-gold-800': '#8c7a5e',
          'color-gold-700': '#978365',
          'color-gold-600': '#b9a88d',
          'color-gold-500': '#cbc0aa',
          'color-gold-400': '#d8d0bf',
          'color-gold-300': '#e1dccf',
          'color-gold-200': '#eae6db',
          'color-gold-100': '#f2f0e7',
          'color-gold-50': '#faf9f2'
        },
        Bronze:
        {
          'color-bronze-950': '#43302b',
          'color-bronze-900': '#7d5e54',
          'color-bronze-800': '#957468',
          'color-bronze-700': '#a18072',
          'color-bronze-600': '#c2a499',
          'color-bronze-500': '#d3bcb3',
          'color-bronze-400': '#dfcdc5',
          'color-bronze-300': '#e7d9d3',
          'color-bronze-200': '#efe4df',
          'color-bronze-100': '#f6edea',
          'color-bronze-50': '#fdf7f5'
        },
        Brown:
        {
          'color-brown-950': '#3e332e',
          'color-brown-900': '#815e46',
          'color-brown-800': '#a07553',
          'color-brown-700': '#ad7f58',
          'color-brown-600': '#cea37e',
          'color-brown-500': '#dcbc9f',
          'color-brown-400': '#e4cdb7',
          'color-brown-300': '#ebdaca',
          'color-brown-200': '#f0e4d9',
          'color-brown-100': '#f6eee7',
          'color-brown-50': '#fcf9f6'
        }



      },

      borderRadius: {
        50: "50px"
      },
      maxWidth: {
        700: "700px",
        600: "600px"
      },
      maxHeight: {
        700: "700px",
        600: "600px",
        "modal": "470px"
      },
      zIndex: {
        10000: "10000"
      },
      width: {
        95: "95%"
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        16: 'repeat(16, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-16': 'span 16 / span 16',
      },
      gridColumnStart: {
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
      },
      gridColumnEnd: {
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
        '17': '17',
      }
    },
  },
};
