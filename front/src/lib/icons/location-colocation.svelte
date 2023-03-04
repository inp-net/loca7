<script lang="ts">
    export let color: string = 'currentColor';
    export let strokeWidth: number = 5;
    export let flip: boolean = false;
            </script><svg style:transform={flip ? "scaleX(-1)" : ""} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.0963 36C18.1182 39.5274 20.8464 42.9893 24.3571 46.5C24.5312 46.3259 24.7112 46.1466 24.8964 45.9622C27.2959 43.5728 30.5711 40.3113 33.3065 36H16.0963Z" fill={color}/>
<path d="M45.8 34C45.8 28.4035 41.2631 23.8667 35.6667 23.8667C34.7438 23.8667 33.8497 23.9901 33 24.2212" stroke={color} stroke-width={strokeWidth}/>
<circle cx="35.6667" cy="17.2" r="4.7" stroke={color} stroke-width={strokeWidth}/>
<path d="M32 34.342C32 26.3339 25.5081 19.842 17.5 19.842C9.49187 19.842 3 26.3339 3 34.342" stroke={color} stroke-width={strokeWidth}/>
<circle cx="17.5" cy="10.3026" r="7.80263" stroke={color} stroke-width={strokeWidth}/>
</svg>
