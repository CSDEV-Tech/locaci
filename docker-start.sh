# export ENV variables
export NEXT_PUBLIC_SITE_URL="https://locaci.fredkiss.dev"
export POSTGRES_USER=$(cat /run/secrets/locaci_postgres_user)
export POSTGRES_PASSWORD=$(cat /run/secrets/locaci_postgres_password)
export CF_ACCESS_KEY_ID=$(cat /run/secrets/locaci_cf_access_key_id)
export CF_ACCESS_KEY_SECRET=$(cat /run/secrets/locaci_cf_access_key_secret)
export CF_ACCOUNT_ID=$(cat /run/secrets/locaci_cf_account_id)
export CF_IMAGES_BUCKET_NAME=$(cat /run/secrets/locaci_cf_images_bucket_name)
export CF_IMAGES_DOMAIN=$(cat /run/secrets/locaci_cf_images_domain)
export NEXT_PUBLIC_CF_IMAGES_URL="https://$CF_IMAGES_DOMAIN"
export JWT_SECRET=$(cat /run/secrets/locaci_jwt_secret)
export OAUTH_CLIENT_SECRET=$(cat /run/secrets/locaci_oauth_cliend_secret)
export DATABASE_URL="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@db:5432/locaci_db?schema=public"
export OSM_SEARCH_URL="http://osm-search:8090"

# Run pnpm
pnpm run start:web