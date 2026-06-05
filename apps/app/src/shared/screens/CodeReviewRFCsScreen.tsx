import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@app/shared/context/ThemeContext';
import { AppText } from '@app/shared/components/atoms/AppText';

export const CodeReviewRFCsScreen: React.FC = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const { theme } = useTheme();

  // State for interactive checklist
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    typecheck: false,
    linting: false,
    tests: false,
    noTodo: false,
    noLet: false,
    exportedInterfaces: false,
  });

  // State for coding standard display toggle
  const [activeCodeTab, setActiveCodeTab] = useState<'interfaces' | 'consts'>('interfaces');

  // Helper to toggle checklist state
  const toggleChecklistItem = (key: string) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderChecklistItem = (key: string, label: string) => {
    const isChecked = checklist[key];
    return (
      <TouchableOpacity
        key={key}
        style={[
          styles.checklistItem,
          { backgroundColor: theme.card, borderColor: isChecked ? theme.primary : theme.cardBorder },
        ]}
        onPress={() => toggleChecklistItem(key)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            {
              borderColor: isChecked ? theme.primary : theme.textMuted,
              backgroundColor: isChecked ? theme.primary : 'transparent',
            },
          ]}
        >
          {isChecked && <Text style={[styles.checkMark, { color: theme.background }]}>✓</Text>}
        </View>
        <AppText
          variant="body"
          style={[
            styles.checklistLabel,
            { color: isChecked ? theme.text : theme.textMuted, textDecorationLine: isChecked ? 'line-through' : 'none' },
          ]}
        >
          {label}
        </AppText>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingTop: 16, paddingBottom: safeAreaInsets.bottom + 32, paddingHorizontal: 16 }}
    >
      {/* Header section */}
      <View style={styles.header}>
        <AppText variant="bold" style={[styles.title, { color: theme.text }]}>
          📚 Standards & RFCs
        </AppText>
        <AppText variant="subtitle" style={[styles.subtitle, { color: theme.textMuted }]}>
          Engineering Code Review Checklist, Coding Guidelines, and the RFC Process for Ajay's Production Workspace.
        </AppText>
      </View>

      {/* Interactive PR Checklist */}
      <View style={styles.section}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary }]}>
          ✅ Interactive Pre-PR Checklist
        </AppText>
        <AppText variant="body" style={[styles.sectionDesc, { color: theme.textMuted }]}>
          Tap each requirement to check off your readiness before opening a Pull Request.
        </AppText>

        <View style={styles.checklistContainer}>
          {renderChecklistItem('typecheck', 'TypeScript builds with zero compile errors.')}
          {renderChecklistItem('linting', 'Prettier formatting and ESLint rules applied.')}
          {renderChecklistItem('tests', 'All Jest unit tests pass successfully.')}
          {renderChecklistItem('noTodo', 'No incomplete TODOs or stray debugging logs.')}
          {renderChecklistItem('noLet', 'Preferred const declarations used instead of let.')}
          {renderChecklistItem('exportedInterfaces', 'Exported interfaces chosen for object structures.')}
        </View>
      </View>

      {/* Code Standards Playground Toggle */}
      <View style={styles.section}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary }]}>
          💻 Code Style Preferences
        </AppText>
        <AppText variant="body" style={[styles.sectionDesc, { color: theme.textMuted }]}>
          Tap the buttons below to check code rules.
        </AppText>

        {/* Tab switch buttons */}
        <View style={styles.codeTabs}>
          <TouchableOpacity
            style={[
              styles.codeTabBtn,
              activeCodeTab === 'interfaces' && { backgroundColor: theme.primary + '15', borderColor: theme.primary },
            ]}
            onPress={() => setActiveCodeTab('interfaces')}
          >
            <AppText
              variant="bold"
              style={[styles.tabBtnText, { color: activeCodeTab === 'interfaces' ? theme.primary : theme.textMuted }]}
            >
              Exported Interfaces
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.codeTabBtn,
              activeCodeTab === 'consts' && { backgroundColor: theme.primary + '15', borderColor: theme.primary },
            ]}
            onPress={() => setActiveCodeTab('consts')}
          >
            <AppText
              variant="bold"
              style={[styles.tabBtnText, { color: activeCodeTab === 'consts' ? theme.primary : theme.textMuted }]}
            >
              Const over Let
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Dynamic code styling code snippets */}
        <View style={[styles.codeDisplay, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {activeCodeTab === 'interfaces' ? (
            <>
              <View style={styles.codeBlockRow}>
                <Text style={styles.badgeBad}>❌ BAD STYLE</Text>
                <Text style={[styles.codeSnippet, { color: theme.text }]}>
                  {`type UserProfile = {\n  id: string;\n  name: string;\n};`}
                </Text>
              </View>
              <View style={[styles.codeBlockRow, { borderTopWidth: 1, borderTopColor: theme.cardBorder, paddingTop: 12 }]}>
                <Text style={styles.badgeGood}>✨ RECOMMENDED</Text>
                <Text style={[styles.codeSnippet, { color: theme.text }]}>
                  {`export interface UserProfile {\n  id: string;\n  name: string;\n}`}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.codeBlockRow}>
                <Text style={styles.badgeBad}>❌ BAD STYLE</Text>
                <Text style={[styles.codeSnippet, { color: theme.text }]}>
                  {`let totalAmount = 100;\nlet listItems = ['a', 'b'];`}
                </Text>
              </View>
              <View style={[styles.codeBlockRow, { borderTopWidth: 1, borderTopColor: theme.cardBorder, paddingTop: 12 }]}>
                <Text style={styles.badgeGood}>✨ RECOMMENDED</Text>
                <Text style={[styles.codeSnippet, { color: theme.text }]}>
                  {`const totalAmount = 100;\nconst listItems = ['a', 'b'];`}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* RFC Submission Lifecyle */}
      <View style={styles.section}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary }]}>
          🚀 RFC Process Lifecycle
        </AppText>
        <AppText variant="body" style={[styles.sectionDesc, { color: theme.textMuted }]}>
          The four stages a technical proposal transitions through for approvals.
        </AppText>

        <View style={styles.lifecycleContainer}>
          <View style={[styles.lifecycleStep, { borderLeftColor: theme.primary }]}>
            <View style={[styles.circleStep, { backgroundColor: theme.primary }]}>
              <Text style={styles.stepNum}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <AppText variant="bold" style={{ color: theme.text }}>Write Draft</AppText>
              <AppText variant="body" style={{ color: theme.textMuted, fontSize: 13 }}>
                Author outlines the design, alternatives, risks, and verification plan.
              </AppText>
            </View>
          </View>

          <View style={[styles.lifecycleStep, { borderLeftColor: theme.primary }]}>
            <View style={[styles.circleStep, { backgroundColor: theme.primary }]}>
              <Text style={styles.stepNum}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <AppText variant="bold" style={{ color: theme.text }}>Request Review</AppText>
              <AppText variant="body" style={{ color: theme.textMuted, fontSize: 13 }}>
                A PR is raised against the docs/rfcs directory for comments and feedback.
              </AppText>
            </View>
          </View>

          <View style={[styles.lifecycleStep, { borderLeftColor: theme.primary }]}>
            <View style={[styles.circleStep, { backgroundColor: theme.primary }]}>
              <Text style={styles.stepNum}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <AppText variant="bold" style={{ color: theme.text }}>Resolve Discussion</AppText>
              <AppText variant="body" style={{ color: theme.textMuted, fontSize: 13 }}>
                Team aligns on technical tradeoffs, resolving active concerns.
              </AppText>
            </View>
          </View>

          <View style={[styles.lifecycleStep, { borderLeftWidth: 0 }]}>
            <View style={[styles.circleStep, { backgroundColor: '#10B981' }]}>
              <Text style={styles.stepNum}>✓</Text>
            </View>
            <View style={styles.stepContent}>
              <AppText variant="bold" style={{ color: theme.text }}>Approval & Merge</AppText>
              <AppText variant="body" style={{ color: theme.textMuted, fontSize: 13 }}>
                The proposal is approved, merged, and the implementation phase begins.
              </AppText>
            </View>
          </View>
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
  checklistContainer: {
    gap: 10,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkMark: {
    fontSize: 12,
    fontWeight: '900',
  },
  checklistLabel: {
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
  },
  codeTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  codeTabBtn: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBtnText: {
    fontSize: 13,
  },
  codeDisplay: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  codeBlockRow: {
    gap: 6,
  },
  badgeBad: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
    backgroundColor: '#EF444415',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeGood: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
    backgroundColor: '#10B98115',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  codeSnippet: {
    fontFamily: 'Courier',
    fontSize: 13,
    lineHeight: 18,
  },
  lifecycleContainer: {
    paddingLeft: 12,
  },
  lifecycleStep: {
    borderLeftWidth: 2,
    paddingLeft: 20,
    paddingBottom: 24,
    position: 'relative',
  },
  circleStep: {
    width: 26,
    height: 26,
    borderRadius: 13,
    position: 'absolute',
    left: -14,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNum: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  stepContent: {
    gap: 4,
    top: -2,
  },
});
