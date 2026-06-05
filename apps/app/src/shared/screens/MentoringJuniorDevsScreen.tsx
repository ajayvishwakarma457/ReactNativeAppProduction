import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@app/shared/context/ThemeContext';
import { AppText } from '@app/shared/components/atoms/AppText';

export const MentoringJuniorDevsScreen: React.FC = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const { theme } = useTheme();

  // Tab State for Onboarding Roadmap (30-60-90 Days)
  const [activePlanTab, setActivePlanTab] = useState<'30' | '60' | '90'>('30');

  // Pair programming simulation state
  const [pairRole, setPairRole] = useState<'driver' | 'navigator'>('driver');

  // Interactive Checklist State
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    environment: false,
    smallFix: false,
    pairSession: false,
    firstReview: false,
    ownFeature: false,
    writeRfc: false,
  });

  const toggleChecklist = (key: string) => {
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
        onPress={() => toggleChecklist(key)}
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
      {/* Header Panel */}
      <View style={styles.header}>
        <AppText variant="bold" style={[styles.title, { color: theme.text }]}>
          🌱 Mentoring Junior Devs
        </AppText>
        <AppText variant="subtitle" style={[styles.subtitle, { color: theme.textMuted }]}>
          Structured training blueprints, pair-programming roles, and progress milestones for scaling talent.
        </AppText>
      </View>

      {/* 30-60-90 Day Plan Interactive Tabs */}
      <View style={styles.section}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary }]}>
          📅 Onboarding Roadmap (30-60-90 Days)
        </AppText>
        <AppText variant="body" style={[styles.sectionDesc, { color: theme.textMuted }]}>
          Select a time block to view targeted training priorities and integration targets.
        </AppText>

        <View style={styles.tabBar}>
          {(['30', '60', '90'] as const).map((tab) => {
            const isActive = activePlanTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  isActive && { borderBottomColor: theme.primary, borderBottomWidth: 3 },
                ]}
                onPress={() => setActivePlanTab(tab)}
              >
                <AppText
                  variant="bold"
                  style={[styles.tabText, { color: isActive ? theme.primary : theme.textMuted }]}
                >
                  Day {tab}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {activePlanTab === '30' && (
            <>
              <AppText variant="bold" style={[styles.planTitle, { color: theme.text }]}>
                🎯 Target: Onboarding & Setup
              </AppText>
              <AppText variant="body" style={[styles.planBody, { color: theme.textMuted }]}>
                Focus on establishing local workspace environments, understanding the monorepo configuration, and shipping minor bug fixes to familiarize with CI/CD deployment runs.
              </AppText>
            </>
          )}
          {activePlanTab === '60' && (
            <>
              <AppText variant="bold" style={[styles.planTitle, { color: theme.text }]}>
                🎯 Target: Co-working & Collaborating
              </AppText>
              <AppText variant="body" style={[styles.planBody, { color: theme.textMuted }]}>
                Integrate deeper into feature teams. Engage in driver-navigator pair programming sessions, submit medium features under supervisor review, and participate in peer code discussions.
              </AppText>
            </>
          )}
          {activePlanTab === '90' && (
            <>
              <AppText variant="bold" style={[styles.planTitle, { color: theme.text }]}>
                🎯 Target: Autonomy & Ownership
              </AppText>
              <AppText variant="body" style={[styles.planBody, { color: theme.textMuted }]}>
                Take full responsibility for custom feature branches, author design RFC documents for major refactors, and review pull requests for new team additions.
              </AppText>
            </>
          )}
        </View>
      </View>

      {/* Driver-Navigator Simulation Interactive Selector */}
      <View style={styles.section}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary }]}>
          🚗 Pair Programming Roles
        </AppText>
        <AppText variant="body" style={[styles.sectionDesc, { color: theme.textMuted }]}>
          Select a role to learn its duties and best practices.
        </AppText>

        <View style={styles.roleTabs}>
          <TouchableOpacity
            style={[
              styles.roleBtn,
              pairRole === 'driver' && { backgroundColor: theme.primary + '15', borderColor: theme.primary },
            ]}
            onPress={() => setPairRole('driver')}
          >
            <AppText
              variant="bold"
              style={[styles.roleBtnText, { color: pairRole === 'driver' ? theme.primary : theme.textMuted }]}
            >
              💻 The Driver
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleBtn,
              pairRole === 'navigator' && { backgroundColor: theme.primary + '15', borderColor: theme.primary },
            ]}
            onPress={() => setPairRole('navigator')}
          >
            <AppText
              variant="bold"
              style={[styles.roleBtnText, { color: pairRole === 'navigator' ? theme.primary : theme.textMuted }]}
            >
              🧭 The Navigator
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={[styles.roleDetails, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {pairRole === 'driver' ? (
            <>
              <AppText variant="bold" style={{ color: theme.text, marginBottom: 6 }}>
                Responsibilities of The Driver:
              </AppText>
              <Text style={[styles.bulletPoint, { color: theme.textMuted }]}>
                • Write clean, typecheck-passing TypeScript code.
              </Text>
              <Text style={[styles.bulletPoint, { color: theme.textMuted }]}>
                • Implement immediate functions, styles, and hooks.
              </Text>
              <Text style={[styles.bulletPoint, { color: theme.textMuted }]}>
                • Think out loud to share syntax decisions with the navigator.
              </Text>
            </>
          ) : (
            <>
              <AppText variant="bold" style={{ color: theme.text, marginBottom: 6 }}>
                Responsibilities of The Navigator:
              </AppText>
              <Text style={[styles.bulletPoint, { color: theme.textMuted }]}>
                • Focus on the high-level design and structure.
              </Text>
              <Text style={[styles.bulletPoint, { color: theme.textMuted }]}>
                • Scan for edge cases, performance improvements, and syntax standard guidelines.
              </Text>
              <Text style={[styles.bulletPoint, { color: theme.textMuted }]}>
                • Check compilation outputs and prevent logical bugs ahead of time.
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Interactive Milestone Checklists */}
      <View style={styles.section}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary }]}>
          🏆 Onboarding Milestone Checklist
        </AppText>
        <AppText variant="body" style={[styles.sectionDesc, { color: theme.textMuted }]}>
          Track training objectives completed by the junior engineer.
        </AppText>

        <View style={styles.checklistContainer}>
          {renderChecklistItem('environment', 'Developer workspace and native tools configured.')}
          {renderChecklistItem('smallFix', 'First bug fix merged into staging environment.')}
          {renderChecklistItem('pairSession', 'Completed first driver-navigator pairing block.')}
          {renderChecklistItem('firstReview', 'Conducted first PR review for a team member.')}
          {renderChecklistItem('ownFeature', 'Owned and shipped a full user-facing feature.')}
          {renderChecklistItem('writeRfc', 'Authored and defended a technical design RFC.')}
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
  tabBar: {
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
    fontSize: 14,
  },
  planCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  planBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  roleTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  roleBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBtnText: {
    fontSize: 14,
  },
  roleDetails: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
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
});
