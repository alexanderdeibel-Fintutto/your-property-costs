/// <reference types="@types/google.maps" />
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AddressComponents {
  street: string;
  houseNumber: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formattedAddress: string;
  placeId: string;
  latitude: number | null;
  longitude: number | null;
}

interface Prediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

interface UseGoogleMapsAutocompleteProps {
  inputRef: React.RefObject<HTMLInputElement>;
  onPlaceSelect: (address: AddressComponents) => void;
  countryRestrictions?: string[];
}

export const useGoogleMapsAutocomplete = ({
  inputRef,
  onPlaceSelect,
}: UseGoogleMapsAutocompleteProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const sessionTokenRef = useRef<string>(crypto.randomUUID());
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPredictions = useCallback(async (input: string) => {
    if (!input || input.length < 3) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.functions.invoke('google-maps-proxy', {
        body: {
          action: 'autocomplete',
          input,
          sessionToken: sessionTokenRef.current,
        },
      });

      if (fetchError) {
        console.error('Autocomplete error:', fetchError);
        setError('Adresssuche nicht verfügbar');
        setPredictions([]);
        return;
      }

      if (data?.predictions) {
        setPredictions(data.predictions);
        setShowDropdown(data.predictions.length > 0);
      } else {
        setPredictions([]);
        setShowDropdown(false);
      }
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setError('Fehler bei der Adresssuche');
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectPlace = useCallback(async (placeId: string) => {
    setIsLoading(true);
    setShowDropdown(false);

    try {
      const { data, error: fetchError } = await supabase.functions.invoke('google-maps-proxy', {
        body: {
          action: 'details',
          placeId,
          sessionToken: sessionTokenRef.current,
        },
      });

      // Generate new session token after place selection (billing optimization)
      sessionTokenRef.current = crypto.randomUUID();

      if (fetchError || !data?.result) {
        console.error('Place details error:', fetchError);
        setError('Adressdetails nicht verfügbar');
        return;
      }

      const result = data.result;
      const components: AddressComponents = {
        street: '',
        houseNumber: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        formattedAddress: result.formatted_address || '',
        placeId: result.place_id || '',
        latitude: result.geometry?.location?.lat || null,
        longitude: result.geometry?.location?.lng || null,
      };

      result.address_components?.forEach((component: { types: string[]; long_name: string }) => {
        const types = component.types;
        if (types.includes('route')) {
          components.street = component.long_name;
        }
        if (types.includes('street_number')) {
          components.houseNumber = component.long_name;
        }
        if (types.includes('locality')) {
          components.city = component.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          components.state = component.long_name;
        }
        if (types.includes('postal_code')) {
          components.postalCode = component.long_name;
        }
        if (types.includes('country')) {
          components.country = component.long_name;
        }
      });

      onPlaceSelect(components);
      setPredictions([]);
    } catch (err) {
      console.error('Error fetching place details:', err);
      setError('Fehler beim Laden der Adresse');
    } finally {
      setIsLoading(false);
    }
  }, [onPlaceSelect]);

  const handleInputChange = useCallback((value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchPredictions(value);
    }, 300);
  }, [fetchPredictions]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    error,
    predictions,
    showDropdown,
    setShowDropdown,
    handleInputChange,
    selectPlace,
  };
};
