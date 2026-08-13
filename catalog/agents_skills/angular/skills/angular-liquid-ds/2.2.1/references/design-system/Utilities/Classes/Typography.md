# Typography

Documentação e exemplos de tipografia para uso conforme os padrões do Liquid, incluindo configurações globais, títulos, corpo do texto, subtítulos e link. .



| Font Family | Class |
| --- | --- |
| "Bradesco", sans-serif" | brad-font-family-primary |

# Títulos

| Figma Name | Classes | Font Size  REM \| PX \| Token | Font Weight  Value \| Token | Line Height  REM \| PX \| Token |
| --- | --- | --- | --- | --- |
| Title Xl | brad-font-title-xl | 1.375 rem \| 22px brad-font-size-xl | 600 brad-font-weight-semibold | 2 rem \| 32px brad-line-height-lg |
| Title Lg | brad-font-title-lg | 1.25 rem \| 20px brad-font-size-lg | 600 brad-font-weight-semibold | 2 rem \| 32px brad-line-height-lg |
| Title Md | brad-font-title-md | 1 rem \| 16px brad-font-size-md | 600 brad-font-weight-semibold | 1.25 rem \| 20px brad-line-height-md |
| Title Sm | brad-font-title-sm | 0.875 rem \| 14px brad-font-size-sm | 600 brad-font-weight-semibold | 1.25 rem \| 20px brad-line-height-md |



# Subtítulos

| Figma Name | Classes | Font Size  REM \| PX \| Token | Font Weight  Value \| Token | Line Height  REM \| PX \| Token |
| --- | --- | --- | --- | --- |
| Subtitle Sm | brad-font-subtitle-sm | 0.875 rem \| 14px brad-font-size-sm | 600 brad-font-weight-semibold | 1.25 rem \| 20px brad-line-height-md |
| Subtitle Xs | brad-font-subtitle-xs | 0.750 rem \| 12px brad-font-size-xs | 600 brad-font-weight-semibold | 1 rem \| 16px brad-line-height-sm |
| Subtitle Xxs | brad-font-subtitle-xxs | 0.625 rem \| 10px brad-font-size-xxs | 600 brad-font-weight-semibold | 1 rem \| 16px brad-line-height-sm |



# Parágrafos

| Figma Name | Classes | Font Size  REM \| PX \| Token | Font Weight  Value \| Token | Line Height  REM \| PX \| Token |
| --- | --- | --- | --- | --- |
| Paragraph Md | brad-font-paragraph-md | 1 rem \| 16px brad-font-size-md | 500 brad-font-weight-medium | 1.25 rem \| 20px brad-line-height-md |
| Paragraph Sm | brad-font-paragraph-sm | 0.875 rem \| 14px brad-font-size-sm | 500 brad-font-weight-medium | 1 rem \| 16px brad-line-height-sm |



# Link

| Figma Name | Classes | Font Size  REM \| PX \| Token | Font Weight  Value \| Token | Line Height  REM \| PX \| Token |
| --- | --- | --- | --- | --- |
| Link Md | brad-font-link-md | 1 rem \| 16px brad-font-size-md | 600 brad-font-weight-semibold | 1.25 rem \| 20px brad-line-height-md |
| Link Sm | brad-font-link-sm | 0.875 rem \| 14px brad-font-size-sm | 600 brad-font-weight-semibold | 1 rem \| 16px brad-line-height-sm |



# Font Weight

| Classes | Exemplo |
| --- | --- |
| brad-font-weight-regular | 400 |
| brad-font-weight-medium | 500 |
| brad-font-weight-semibold | 600 |
| brad-font-weight-bold | 700 |



# Exemplo
```
<section class="brad-m-lg-b">
  <div class="examples">
    <div class="brad-card brad-p-md brad-font-title-sm ">
      brad-font-title-sm
    </div>
  </div>
</section>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| typography | Altera fonte string |  | Choose option... brad-font-title-sm brad-font-title-md brad-font-title-lg brad-font-title-xl brad-font-paragraph-sm brad-font-paragraph-md brad-font-subtitle-xxs brad-font-subtitle-xs brad-font-subtitle-sm brad-font-link-md brad-font-link-sm |
| fontWeight | Altera o peso da fonte string |  | Choose option... brad-font-weight-bold brad-font-weight-semibold brad-font-weight-medium brad-font-weight-regular |