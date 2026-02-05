import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentifizierung erforderlich' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the JWT token
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Ungültige Authentifizierung' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!googleMapsApiKey) {
      console.error('GOOGLE_MAPS_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Google Maps API nicht konfiguriert' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { action, input, sessionToken, placeId } = body;

    if (!action) {
      return new Response(
        JSON.stringify({ error: 'Action is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let googleResponse;

    switch (action) {
      case 'autocomplete': {
        if (!input) {
          return new Response(
            JSON.stringify({ error: 'Input is required for autocomplete' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate and sanitize input (max 500 chars, alphanumeric + spaces + common address chars)
        const sanitizedInput = String(input).slice(0, 500);
        
        const params = new URLSearchParams({
          input: sanitizedInput,
          key: googleMapsApiKey,
          types: 'address',
          components: 'country:de|country:at|country:ch',
          language: 'de',
        });

        if (sessionToken) {
          params.append('sessiontoken', String(sessionToken));
        }

        googleResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`
        );
        break;
      }

      case 'details': {
        if (!placeId) {
          return new Response(
            JSON.stringify({ error: 'placeId is required for details' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate placeId format (alphanumeric with underscores and hyphens)
        const sanitizedPlaceId = String(placeId).slice(0, 300);

        const params = new URLSearchParams({
          place_id: sanitizedPlaceId,
          key: googleMapsApiKey,
          fields: 'address_components,formatted_address,geometry,place_id',
          language: 'de',
        });

        if (sessionToken) {
          params.append('sessiontoken', String(sessionToken));
        }

        googleResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?${params}`
        );
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Supported: autocomplete, details' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    if (!googleResponse.ok) {
      console.error('Google Maps API error:', googleResponse.status);
      return new Response(
        JSON.stringify({ error: 'Google Maps API Fehler' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await googleResponse.json();

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in google-maps-proxy function:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(
      JSON.stringify({ error: 'Interner Serverfehler' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
