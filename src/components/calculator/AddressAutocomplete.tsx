import { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useGoogleMapsAutocomplete, AddressComponents } from '@/hooks/useGoogleMapsAutocomplete';
import { cn } from '@/lib/utils';

interface AddressAutocompleteProps {
  value: string;
  onAddressSelect: (address: AddressComponents) => void;
  onInputChange: (value: string) => void;
  isVerified: boolean;
  verifiedAddress?: string;
}

export const AddressAutocomplete = ({
  value,
  onAddressSelect,
  onInputChange,
  isVerified,
  verifiedAddress,
}: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const {
    isLoading,
    error,
    predictions,
    showDropdown,
    setShowDropdown,
    handleInputChange,
    selectPlace,
  } = useGoogleMapsAutocomplete({
    inputRef,
    onPlaceSelect: (address) => {
      onAddressSelect(address);
      onInputChange(address.formattedAddress);
    },
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onInputChange(newValue);
    handleInputChange(newValue);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDropdown]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="adresse" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Objektadresse
        </Label>
        {isVerified && (
          <Badge variant="outline" className="text-success border-success gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Verifiziert
          </Badge>
        )}
      </div>

      <div className="relative">
        <Input
          ref={inputRef}
          id="adresse"
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => {
            setIsFocused(true);
            if (predictions.length > 0) setShowDropdown(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Straße, Hausnummer, Stadt eingeben..."
          className={cn(
            'pr-10 transition-all',
            isVerified && 'border-success focus-visible:ring-success',
            error && 'border-destructive'
          )}
          autoComplete="off"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : isVerified ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : error ? (
            <AlertCircle className="h-4 w-4 text-destructive" />
          ) : (
            <MapPin className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        {/* Predictions Dropdown */}
        {showDropdown && predictions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-muted transition-colors flex items-start gap-2 border-b border-border last:border-0"
                onClick={() => selectPlace(prediction.place_id)}
              >
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {prediction.structured_formatting?.main_text || prediction.description}
                  </p>
                  {prediction.structured_formatting?.secondary_text && (
                    <p className="text-xs text-muted-foreground truncate">
                      {prediction.structured_formatting.secondary_text}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}

      {!error && !isVerified && value && (
        <p className="text-xs text-muted-foreground">
          Wähle eine Adresse aus den Vorschlägen, um sie zu verifizieren
        </p>
      )}

      {isVerified && verifiedAddress && (
        <p className="text-xs text-success">
          ✓ {verifiedAddress}
        </p>
      )}
    </div>
  );
};
