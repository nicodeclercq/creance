cat > ./src/secrets.ts << EOF
export const secrets = {
  salt: '$SALT',
  supabaseUrl: '$SUPABASE_URL',
  supabaseKey: '$SUPABASE_KEY',
};
EOF
