import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@app/shared/context/ThemeContext';
import { AppText } from '@app/shared/components/atoms/AppText';

export const CodingStandardsLintingScreen: React.FC = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const { theme } = useTheme();

  // Config tab state
  const [activeConfigTab, setActiveConfigTab] = useState<'eslint' | 'prettier' | 'tsconfig'>('eslint');

  // Interactive FAQ state (expanded questions)
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const toggleFaq = (key: string) => {
    setExpandedFaq(expandedFaq === key ? null : key);
  };

  const renderFaqItem = (key: string, question: string, answer: string) => {
    const isExpanded = expandedFaq === key;
    return (
      <View key={key} style={[styles.faqCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <TouchableOpacity style={styles.faqHeader} onPress={() => toggleFaq(key)} activeOpacity={0.7}>
          <AppText variant="bold" style={{ color: theme.text, flex: 1 }}>
            {question}
          </AppText>
          <Text style={{ color: theme.primary, fontSize: 16, fontWeight: '700' }}>
            {isExpanded ? '−' : '+'}
          </Text>
        </TouchableOpacity>
        {isExpanded && (
          <AppText variant="body" style={[styles.faqAnswer, { color: theme.textMuted }]}>
            {answer}
          </AppText>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingTop: 16, paddingBottom: safeAreaInsets.bottom + 32, paddingHorizontal: 16 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="bold" style={[styles.title, { color: theme.text }]}>
          ⚙️ Code Style & Lint Rules
        </AppText>
        <AppText variant="subtitle" style={[styles.subtitle, { color: theme.textMuted }]}>
          Workspace ESLint, Prettier formatter details, and custom TypeScript quality rules.
        </AppText>
      </View>

      {/* Configurations Panel */}
      <View style={styles.section}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary }]}>
          📦 Configuration Files Browser
        </AppText>
        <AppText variant="body" style={[styles.sectionDesc, { color: theme.textMuted }]}>
          Tap tabs to view current rules loaded by the bundlers.
        </AppText>

        <View style={styles.configTabs}>
          {(['eslint', 'prettier', 'tsconfig'] as const).map((tab) => {
            const isActive = activeConfigTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  isActive && { borderBottomColor: theme.primary, borderBottomWidth: 3 },
                ]}
                onPress={() => setActiveConfigTab(tab)}
              >
                <AppText
                  variant="bold"
                  style={[styles.tabText, { color: isActive ? theme.primary : theme.textMuted }]}
                >
                  {tab === 'eslint' ? '.eslintrc.js' : tab === 'prettier' ? '.prettierrc.js' : 'tsconfig.json'}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.codeDisplayCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {activeConfigTab === 'eslint' && (
            <Text style={[styles.codeText, { color: theme.text }]}>
              {`module.exports = {\n  root: true,\n  extends: '@react-native',\n};`}
            </Text>
          )}
          {activeConfigTab === 'prettier' && (
            <Text style={[styles.codeText, { color: theme.text }]}>
              {`module.exports = {\n  arrowParens: 'avoid',\n  singleQuote: true,\n  trailingComma: 'all',\n};`}
            </Text>
          )}
          {activeConfigTab === 'tsconfig' && (
            <Text style={[styles.codeText, { color: theme.text }]}>
              {`{\n  "compilerOptions": {\n    "strict": true,\n    "noImplicitAny": true,\n    "strictNullChecks": true\n  }\n}`}
            </Text>
          )}
        </View>
      </View>

      {/* Rules Explanations accordion */}
      <View style={styles.section}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary }]}>
          💡 Detailed Rules Reference
        </AppText>
        <AppText variant="body" style={[styles.sectionDesc, { color: theme.textMuted }]}>
          Tap any standard rule below to see why the rule exists.
        </AppText>

        <View style={styles.faqList}>
          {renderFaqItem(
            'const',
            'Why prefer const over let?',
            'Using const makes code easier to read. It guarantees the reference will not be reassigned, helping prevent accidental overwrite errors and indicating state immutability.'
          )}
          {renderFaqItem(
            'interfaces',
            'Why prefer exported interfaces for objects?',
            'TypeScript interfaces allow clean class implementation extends, object merges, and consistent typing declarations. Exporting them allows standard reusability in different libraries.'
          )}
          {renderFaqItem(
            'strictCheck',
            'Why keep strict typechecks active?',
            'Enabling strict null/any compiling prevents production runtime errors (like "undefined is not a function") and ensures accurate type definitions across monorepo boundaries.'
          )}
          {renderFaqItem(
            'trailingComma',
            'Why enforce trailingComma="all"?',
            'Appending trailing commas simplifies git commits diff list. When lines are added or removed inside arrays/objects, only the changed item registers in the git diff block.'
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    marginBottom: 16,
  },
  configTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#33415515',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
  },
  codeDisplayCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 13,
    lineHeight: 18,
  },
  faqList: {
    gap: 10,
  },
  faqCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
  },
});
