# ELETTRONICAL — sito web

Sito statico della rete **ELETTRONICAL**, l'alleanza delle eccellenze
dell'ingegneria elettronica e dell'hardware in Calabria.

Pubblicato con **GitHub Pages** sul dominio **[elettronical.it](https://elettronical.it)**.

## Tecnologia

Solo HTML + un foglio CSS + JavaScript vanilla. Nessun framework, build o CMS.

```
index.html        Home (carosello, obiettivi, ultime news, CTA adesione)
afferenti.html    Griglia delle aziende afferenti (da members.json)
news.html         Elenco cronologico completo delle notizie (da news.json)
style.css         Foglio di stile unico
script.js         Carosello + caricamento dinamico dei JSON
members.json      Elenco degli afferenti
news.json         Elenco delle notizie
assets/           Logo, carosello (WebP), loghi aziende, favicon, banner OG
CNAME             Dominio personalizzato (elettronical.it)
```

## Aggiornare i contenuti

I contenuti sono guidati dai dati: **non serve toccare l'HTML**.

- **Aggiungere un'azienda** → aggiungi un oggetto a [`members.json`](members.json)
  e metti il logo in `assets/logos/`:
  ```json
  {
    "nome": "Nome Azienda",
    "sito": "https://www.esempio.it",
    "logo": "assets/logos/esempio.png",
    "descrizione": "Breve descrizione dell'attività."
  }
  ```

- **Pubblicare una notizia** → aggiungi un oggetto a [`news.json`](news.json):
  ```json
  {
    "id": "slug-univoco",
    "titolo": "Titolo della notizia",
    "data": "2026-07-01",
    "estratto": "Una o due frasi di anteprima.",
    "testo": "Testo completo. Separa i paragrafi con una riga vuota."
  }
  ```
  La home mostra automaticamente le 3 notizie con data più recente;
  `news.html` le elenca tutte (più recente in alto).

## DNS e dominio

Vedi [`DNS-SETUP.md`](DNS-SETUP.md) per i record da configurare presso il registrar.
