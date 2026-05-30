import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthStackParamList } from '@types/navigation.types';
import { Button } from '@components/ui/Button';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useAuth } from '@hooks/useAuth';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { signUp, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async () => {
    if (!email || !password || !username) return;
    try {
      await signUp({ email: email.trim(), password, username: username.trim() });
      navigation.replace('SignIn');
    } catch {
      // toast already shown
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable hitSlop={10} onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={26} color="#ffffff" />
        </Pressable>
        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start editing in seconds.</Text>
        </View>

        <View style={styles.form}>
          <Field icon="person" placeholder="Username" value={username} onChange={setUsername} autoCapitalize="none" />
          <Field icon="mail" placeholder="Email" value={email} onChange={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Field
            icon="lock"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? 'visibility' : 'visibility-off'}
            onRightPress={() => setShowPassword(s => !s)}
          />
        </View>

        <Button label="Create account" variant="primary" size="lg" fullWidth loading={isLoading} onPress={onSubmit} />

        <Pressable onPress={() => navigation.replace('SignIn')} style={styles.footerLink}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerHighlight}>Sign in</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface FieldProps {
  icon: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  rightIcon?: string;
  onRightPress?: () => void;
}

function Field({ icon, placeholder, value, onChange, secureTextEntry, keyboardType, autoCapitalize, rightIcon, onRightPress }: FieldProps) {
  return (
    <View style={styles.field}>
      <Icon name={icon} size={20} color={Colors.text.secondary} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.tertiary}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {rightIcon ? (
        <Pressable onPress={onRightPress} hitSlop={8}>
          <Icon name={rightIcon} size={20} color={Colors.text.secondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { flexGrow: 1, padding: Dim.spacing.lg, paddingTop: 48 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: Dim.spacing.xl },
  header: { marginBottom: Dim.spacing.xxxl },
  title: { color: '#ffffff', fontSize: 32, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: Colors.text.secondary, fontSize: Typography.sizes.base },
  form: { gap: Dim.spacing.md, marginBottom: Dim.spacing.xl },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Dim.spacing.md,
    paddingVertical: Dim.spacing.md,
    backgroundColor: Colors.bg.input,
    borderRadius: Dim.radius.md,
    gap: 10,
  },
  input: { flex: 1, color: '#ffffff', fontSize: Typography.sizes.base },
  footerLink: { marginTop: Dim.spacing.xl, alignItems: 'center' },
  footerText: { color: Colors.text.secondary, fontSize: Typography.sizes.base },
  footerHighlight: { color: Colors.accent.pink, fontWeight: '700' },
});
