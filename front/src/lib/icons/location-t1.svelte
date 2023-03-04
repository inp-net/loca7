<script lang="ts">
    export let color: string = 'currentColor';
    export let strokeWidth: number = 5;
    export let flip: boolean = false;
            </script><svg style:transform={flip ? "scaleX(-1)" : ""} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.0963 36C18.1182 39.5274 20.8464 42.9893 24.3571 46.5C24.5312 46.3259 24.7112 46.1466 24.8964 45.9622C27.2959 43.5728 30.5711 40.3113 33.3065 36H16.0963Z" fill={color}/>
<path d="M14.4873 30V9.12H7.1433V4.8H26.5833V9.12H19.2393V30H14.4873ZM36.7314 30V8.184H36.0834L32.6994 16.176H27.8754L33.0234 4.8H41.3394V30H36.7314Z" fill={color}/>
</svg>
