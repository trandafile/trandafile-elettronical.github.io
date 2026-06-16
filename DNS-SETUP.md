# Configurazione DNS — elettronical.it

Nota per Luigi. Per pubblicare il sito sul dominio personalizzato occorre
configurare questi record presso il **registrar / gestore DNS** di `elettronical.it`.

## 1. Dominio apex (elettronical.it) → 4 record A

Punta il dominio nudo agli IP di GitHub Pages:

| Tipo | Host / Nome | Valore            |
|------|-------------|-------------------|
| A    | `@`         | `185.199.108.153` |
| A    | `@`         | `185.199.109.153` |
| A    | `@`         | `185.199.110.153` |
| A    | `@`         | `185.199.111.153` |

(Opzionale ma consigliato, per IPv6 — record AAAA con host `@`):
`2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`

## 2. Sottodominio www → CNAME

| Tipo  | Host / Nome | Valore                  |
|-------|-------------|-------------------------|
| CNAME | `www`       | `trandafile.github.io.` |

Con questa configurazione `www.elettronical.it` reindirizza automaticamente
all'apex `elettronical.it` (impostato nel file `CNAME` del repository).

## 3. Su GitHub

1. Repository **Settings → Pages**.
2. *Build and deployment*: Source = **Deploy from a branch**, Branch = **main / (root)**.
3. *Custom domain*: `elettronical.it` (già impostato dal file `CNAME`).
4. Attendi la verifica DNS, poi spunta **Enforce HTTPS**
   (può richiedere fino a 24 h per l'emissione del certificato).

## Note

- La propagazione DNS può richiedere da pochi minuti a 24–48 ore.
- Il file `CNAME` nel repo contiene `elettronical.it`: **non rinominarlo né
  rimuoverlo**, altrimenti GitHub Pages perde il dominio personalizzato.
- Verifica con: `nslookup elettronical.it` e `nslookup www.elettronical.it`.
