import React from 'react';
import { View, Text, TextStyle, StyleProp, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface FormattedTextProps extends Omit<TextProps, 'children' | 'style'> {
  text?: string | null;
  style?: StyleProp<TextStyle>;
  boldStyle?: StyleProp<TextStyle>;
  headingStyle?: StyleProp<TextStyle>;
}

/**
 * Renders text with automatic full support for Markdown:
 * - Headings (###, ##, #)
 * - Bullet items (- or *)
 * - Numbered items (1., 2., etc.)
 * - Inline bold (**text** or *text*)
 * - Paragraph breaks
 */
export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  style,
  boldStyle,
  headingStyle,
  ...rest
}) => {
  const { theme } = useTheme();

  if (!text) return null;

  // Normalize em dashes (—) and en dashes (–) to standard hyphen (-)
  const normalizedText = text.replace(/[—–]/g, '-');
  const lines = normalizedText.split('\n');

  const renderInlineStyles = (content: string, lineKey: string | number) => {
    // Match **text** or *text*
    const parts = content.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        const inner = part.slice(2, -2);
        return (
          <Text key={`${lineKey}-${idx}`} style={[{ fontWeight: 'bold' }, boldStyle]}>
            {inner}
          </Text>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        const inner = part.slice(1, -1);
        return (
          <Text key={`${lineKey}-${idx}`} style={[{ fontWeight: 'bold' }, boldStyle]}>
            {inner}
          </Text>
        );
      }
      return part;
    });
  };

  return (
    <View style={styles.container}>
      {lines.map((rawLine, lIdx) => {
        const line = rawLine.trimEnd();

        // Empty line spacer
        if (!line.trim()) {
          return <View key={lIdx} style={styles.emptyLineSpacer} />;
        }

        // H1 Heading: # Title
        if (line.startsWith('# ')) {
          const content = line.slice(2).trim();
          return (
            <Text
              key={lIdx}
              style={[
                styles.h1,
                { color: theme.primary },
                style,
                headingStyle,
              ]}
              {...rest}
            >
              {renderInlineStyles(content, lIdx)}
            </Text>
          );
        }

        // H2 Heading: ## Title
        if (line.startsWith('## ')) {
          const content = line.slice(3).trim();
          return (
            <Text
              key={lIdx}
              style={[
                styles.h2,
                { color: theme.primary },
                style,
                headingStyle,
              ]}
              {...rest}
            >
              {renderInlineStyles(content, lIdx)}
            </Text>
          );
        }

        // H3 Heading: ### Title
        if (line.startsWith('### ')) {
          const content = line.slice(4).trim();
          return (
            <Text
              key={lIdx}
              style={[
                styles.h3,
                { color: theme.primary },
                style,
                headingStyle,
              ]}
              {...rest}
            >
              {renderInlineStyles(content, lIdx)}
            </Text>
          );
        }

        // Bullet point: - item or * item
        if (line.startsWith('- ') || line.startsWith('* ')) {
          const content = line.slice(2).trim();
          return (
            <View key={lIdx} style={styles.bulletRow}>
              <Text style={[styles.bulletDot, { color: theme.primary }]}>• </Text>
              <Text style={[{ flex: 1 }, styles.bodyText, style]} {...rest}>
                {renderInlineStyles(content, lIdx)}
              </Text>
            </View>
          );
        }

        // Standard Paragraph
        return (
          <Text key={lIdx} style={[styles.bodyText, style]} {...rest}>
            {renderInlineStyles(line, lIdx)}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  emptyLineSpacer: {
    height: 8,
  },
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 6,
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  h3: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    marginBottom: 4,
    paddingLeft: 4,
  },
  bulletDot: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 4,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 2,
  },
});


