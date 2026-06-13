# Cheatsheet komend uruchomienia aplikacji

Odpalałem na linuxie bo mi się wsl dockera na windowsie wywalil ;/

- Zbudowanie obrazów i uruchomienie kontenerów

```
docker compose up -d --build
```

- Podgląd logów ze wszystkich kontenerów

```
docker compose logs -f
```

- usunięcie kontenerów i wyłączenie aplikacji

```
docker compose down
```