import React from 'react';
import { Text, TextStyle, StyleProp, TextProps } from 'react-native';

interface FormattedTextProps extends Omit<TextProps, 'children' | 'style'> {
  text?: string | null;
  style?: StyleProp<TextStyle>;
  boldStyle?: StyleProp<TextStyle>;
}

/**
 * Renders text with automatic support for Markdown bold (**text** or *text*).
 * Strips raw markdown asterisks and renders inner text in bold font weight.
 */
export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  style,
  boldStyle,
  ...rest
}) => {
  if (!text) return null;

  // Normalize em dashes (—) and en dashes (–) to standard hyphen (-)
  const normalizedText = text.replace(/[—–]/g, '-');
  const lines = normalizedText.split('\n');

  return (
    <>
      {lines.map((line, lIdx) => {
        // Match **text** or *text*
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);

        return (
          <Text key={lIdx} style={style} {...rest}>
            {parts.map((part, idx) => {
              if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                const inner = part.slice(2, -2);
                return (
                  <Text key={idx} style={[{ fontWeight: 'bold' }, boldStyle]}>
                    {inner}
                  </Text>
                );
              }
              if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                const inner = part.slice(1, -1);
                return (
                  <Text key={idx} style={[{ fontWeight: 'bold' }, boldStyle]}>
                    {inner}
                  </Text>
                );
              }
              return part;
            })}
            {lIdx < lines.length - 1 ? '\n' : ''}
          </Text>
        );
      })}
    </>
  );
};

