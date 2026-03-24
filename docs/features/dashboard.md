# 3-1. 대시보드 & 분석

## 개요
한 화면에서 회사 전체 상태를 실시간으로 파악하고, AI가 자동으로 위험/기회 알림을 주는 진입점

## 핵심 가치
- **경영진**: 한눈에 전사 현황 파악, 의사결정 지원
- **관리자**: 실시간 문제 감지, 빠른 대응
- **직원**: 개인별 맞춤 정보 제공

## 주요 기능

### 1. 실시간 KPI 위젯

#### 1.1 장비 가동률 (%)
```typescript
interface UtilizationWidget {
  currentRate: number;        // 현재 가동률 (예: 78.5%)
  targetRate: number;         // 목표 가동률 (예: 85%)
  trend: 'up' | 'down';       // 추세
  changePercent: number;      // 전일 대비 변화
  activeEquipment: number;    // 작업 중 장비 수
  totalEquipment: number;     // 전체 장비 수
}
```

**시각화**:
- Radial progress bar (원형 게이지)
- 색상: 80% 이상 초록, 70~80% 노랑, 70% 미만 빨강
- 클릭 시 → 장비 관리 페이지 이동

#### 1.2 프로젝트 진행 상황
```typescript
interface ProjectStatusWidget {
  total: number;              // 전체 프로젝트
  inProgress: number;         // 진행 중
  delayed: number;            // 지연
  completed: number;          // 완료 (이번 주)
  avgCompletionRate: number;  // 평균 진행률 (%)
}
```

**시각화**:
- Horizontal stacked bar
- 지연 프로젝트 빨간색 강조
- 클릭 시 → 프로젝트 목록 (지연 필터링)

#### 1.3 월 매출 예측
```typescript
interface RevenueWidget {
  currentMonth: number;       // 현재까지 매출
  projected: number;          // 월말 예상 매출
  target: number;             // 목표 매출
  confidence: number;         // AI 예측 신뢰도 (%)
  lastMonth: number;          // 전월 실적
}
```

**시각화**:
- Line chart + Forecast line (점선)
- 목표선 대비 현황
- 클릭 시 → 회계 상세 페이지

#### 1.4 안전 위험도 지표
```typescript
interface SafetyWidget {
  riskLevel: 'low' | 'medium' | 'high';
  openIncidents: number;      // 미해결 사건
  todayAlerts: number;        // 오늘 AI 경고 수
  daysWithoutAccident: number;// 무사고 일수
  complianceScore: number;    // 컴플라이언스 점수 (0-100)
}
```

**시각화**:
- Shield icon + 색상 코딩
- 무사고 일수 카운터 (애니메이션)
- 클릭 시 → 안전 관리 페이지

### 2. 이용률 추이 차트

#### 데이터 구조
```typescript
interface UtilizationTrend {
  period: 'day' | 'week' | 'month' | 'year';
  data: Array<{
    date: string;
    utilizationRate: number;
    revenue: number;
    projectCount: number;
  }>;
  comparison: {
    lastPeriod: number;       // 전 기간 대비
    lastYear: number;         // 작년 동기 대비
  };
}
```

#### 기능
- 탭 전환: 일/주/월/년
- 비교 토글: 작년 동기 대비 오버레이
- Zoom & Pan (차트 확대/이동)
- Export: PNG/CSV

#### 시각화
- Dual-axis chart (가동률 + 매출)
- 주말/공휴일 배경 음영
- 이상치 자동 표시 (급락/급등)

### 3. AI 인사이트 카드

#### 예시 인사이트
```typescript
interface AIInsight {
  id: string;
  type: 'warning' | 'opportunity' | 'info';
  title: string;
  description: string;
  metric: {
    label: string;
    value: number;
    change: number;
  };
  actionable: boolean;
  suggestedAction?: string;
  priority: 'high' | 'medium' | 'low';
}
```

**인사이트 예시**:
1. **경고**: "지게차 이용률 12% 하락 – 원인: 유지보수 지연 3건"
   - 액션: "정비 일정 확인하기"

2. **기회**: "이번 주 목요일 크레인 3대 유휴 예정"
   - 액션: "긴급 프로젝트 수주 권장"

3. **정보**: "VIP 고객 A사, 평균 2주마다 재주문"
   - 액션: "사전 견적서 발송"

#### AI 로직
- XGBoost로 이상 패턴 탐지
- LLM이 자연어 설명 생성
- 우선순위 자동 정렬

### 4. 커스텀 대시보드

#### 사용자별 저장
```typescript
interface DashboardConfig {
  userId: string;
  name: string;               // "내 대시보드"
  widgets: Array<{
    type: string;             // 위젯 타입
    position: { x: number; y: number; w: number; h: number };
    config: Record<string, any>;
  }>;
  isDefault: boolean;
}
```

#### 기능
- Drag & Drop 위젯 배치
- 위젯 크기 조정
- 최대 5개 대시보드 저장
- 팀원과 공유 가능

### 5. 알림 센터

#### 알림 타입
```typescript
interface Notification {
  id: string;
  type: 'safety' | 'equipment' | 'project' | 'financial';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}
```

**필터링**:
- 읽지 않음만 보기
- 타입별 필터
- 심각도별 정렬

**실시간 푸시**:
- WebSocket 연결
- 브라우저 알림 (권한 필요)
- 모바일 푸시 (앱)

### 6. 갑사별 출입 보안 등록증 관리

#### 데이터 구조
```typescript
interface SecurityBadge {
  clientId: string;           // 갑사 ID (예: "LG전자")
  clientName: string;
  badges: Array<{
    employeeId: string;
    employeeName: string;
    badgeNumber: string;
    issueDate: Date;
    expiryDate: Date;
    status: 'active' | 'expiring' | 'expired';
    facilityAccess: string[]; // 접근 가능 구역
  }>;
}
```

#### 알림 로직
- 만료 30일 전: Info 알림
- 만료 14일 전: Warning 알림
- 만료 7일 전: Critical 알림 (매일)
- 만료 당일: 자동 작업 배정 차단

#### UI 위젯
```
┌─────────────────────────────────────┐
│ 🔐 보안 등록증 현황                   │
├─────────────────────────────────────┤
│ 🟢 정상: 45명                        │
│ 🟡 만료 임박 (30일 이내): 8명         │
│ 🔴 만료: 2명                         │
├─────────────────────────────────────┤
│ [상세 보기] [갱신 요청]              │
└─────────────────────────────────────┘
```

## 데이터 필드

### API Response
```typescript
interface DashboardData {
  kpis: {
    utilization: UtilizationWidget;
    projects: ProjectStatusWidget;
    revenue: RevenueWidget;
    safety: SafetyWidget;
  };
  trends: UtilizationTrend;
  insights: AIInsight[];
  notifications: Notification[];
  securityBadges: SecurityBadge[];
}
```

## UI/UX

### 레이아웃
```
┌──────────────────────────────────────────────┐
│ KMTLS Next-Gen        🔔(12) 👤 Admin       │
├──────────────────────────────────────────────┤
│ ┌──────┬──────┬──────┬──────┐                │
│ │가동률 │프로젝트│매출 │안전  │  ← KPI 위젯    │
│ │ 78%  │ 24  │ 1.2억│ 🟢  │                │
│ └──────┴──────┴──────┴──────┘                │
│                                              │
│ ┌──────────────────────────────────────┐    │
│ │ 📊 이용률 추이 [일|주|월|년]          │    │
│ │     (차트 영역)                       │    │
│ └──────────────────────────────────────┘    │
│                                              │
│ ┌──────────────────┬───────────────────┐    │
│ │ 💡 AI 인사이트    │ 🔔 최근 알림       │    │
│ │ • 지게차 가동률↓  │ • 장비 A 정비필요  │    │
│ │ • 목요일 유휴 3대 │ • 프로젝트 X 지연  │    │
│ └──────────────────┴───────────────────┘    │
└──────────────────────────────────────────────┘
```

### 반응형
- **Desktop**: 3-4 columns grid
- **Tablet**: 2 columns
- **Mobile**: 1 column, 스와이프 카드

### 다크모드
- 배경: #0a0a0a
- 위젯: #1a1a1a
- 강조: Stitch primary color

### 애니메이션
- 위젯 로딩: Skeleton screen
- 숫자 변화: CountUp 효과
- 차트: Fade-in + Draw animation

## 드릴다운 기능

모든 위젯 클릭 → 해당 모듈 상세 페이지로 이동

**예시**:
- 가동률 위젯 클릭 → `/fleet` (장비 관리)
- 지연 프로젝트 클릭 → `/projects?status=delayed`
- 안전 알림 클릭 → `/safety/incidents/:id`

## 내보내기 기능

### 수동 내보내기
- PDF: 현재 대시보드 스냅샷
- Excel: KPI 원본 데이터
- PNG: 차트 이미지

### 자동 이메일 발송
```typescript
interface ScheduledReport {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;               // "08:00"
  recipients: string[];       // 이메일 목록
  format: 'pdf' | 'excel';
  includeCharts: boolean;
}
```

**기본 설정**:
- 매일 오전 8시
- 경영진 이메일로 PDF 발송
- 전일 KPI + 주간 추이 포함

## 성능 최적화

### 데이터 로딩
- Server-side rendering (SSR)
- Incremental static regeneration (ISR) - 5분마다
- React Query로 캐싱

### 실시간 업데이트
- WebSocket 연결 (위험 알림)
- Polling (KPI - 30초마다)
- Long polling (차트 - 5분마다)

### 차트 최적화
- Canvas 렌더링 (대용량 데이터)
- Virtualization (긴 목록)
- Lazy loading (스크롤시 로드)

## 접근 권한

| 역할 | 접근 가능 위젯 |
|------|---------------|
| 경영진 | 모든 위젯 + 재무 상세 |
| 관리자 | KPI, 프로젝트, 장비, 안전 |
| 현장 관리자 | 프로젝트, 안전, 알림만 |
| 직원 | 개인 대시보드 (맞춤형) |

## 개발 우선순위

### Phase 1 (MVP)
1. KPI 위젯 4개
2. 기본 차트 (일/주 단위)
3. 알림 센터 (기본)

### Phase 2
4. AI 인사이트 카드
5. 커스텀 대시보드
6. 드릴다운 기능

### Phase 3
7. 자동 리포트 이메일
8. 고급 차트 (년 단위, 비교)
9. 보안 등록증 위젯

---

**참고 문서**:
- `/docs/business/kpi.md` - KPI 정의
- `/docs/features/project.md` - 프로젝트 관리 연동
- `/docs/features/fleet.md` - 장비 데이터 연동
