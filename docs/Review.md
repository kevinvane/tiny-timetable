# Review


## 项目 Review 报告

### 项目概况

这是一个「小学生课程表」Web 应用，技术栈为 **Vue 3 + Vite 8 + TypeScript 6 + Pinia + Element Plus + Vue Router**。功能包括周/日视图课程表、课程 CRUD、多主题/深色模式、自定义时间段、打印支持，数据持久化到 localStorage。

整体代码质量不错——结构清晰、类型定义完整、Composition API 使用规范。但以下问题值得关注：

---

### 🔴 Bug / 功能缺陷

#### 1. `index.html` 标题未国际化
```html
<title>tiny-timetable</title>
```
项目标题应为「小学生课程表」，且 `lang="en"` 应改为 `lang="zh-CN"`。`5:7:index.html`

#### 2. 首页「本周课程」统计是假的
```12:91:src/views/Home.vue
<el-statistic title="本周课程" :value="todaySchedule.length * 5" />
```
用 `todaySchedule.length * 5` 估算本周课程数完全不准确——周末可能有课，每天课程数也不同。应遍历周一到周五的 schedule items 汇总。

#### 3. `ScheduleGrid` 未使用用户自定义时间段
```12:29:src/components/schedule/ScheduleGrid.vue
const classTimeSlots = computed(() => {
  return DEFAULT_TIME_SLOTS.filter(slot => slot.type === 'class')
})
```
用户在设置页自定义时间段后，课程表网格仍然使用 `DEFAULT_TIME_SLOTS` 常量，而非 `settingsStore.timeSlots`。设置页的修改不会生效。

#### 4. `TimeAxis` 组件已定义但从未使用
`TimeAxis.vue` 没有被任何组件导入或引用，属于死代码。

#### 5. `HelloWorld.vue` 是脚手架残留
`src/components/HelloWorld.vue` 是 Vite 默认模板的文件，未被使用，应删除。

#### 6. 设置页的「数据管理」按钮全部无功能
```12:213:src/views/Settings.vue
<el-button type="primary"><el-icon><Download /></el-icon>导出数据</el-button>
<el-button><el-icon><Upload /></el-icon>导入数据</el-button>
<el-button type="danger"><el-icon><Delete /></el-icon>清除所有数据</el-button>
```
导出、导入、清除数据按钮均无 `@click` 事件绑定，点击无效果。

#### 7. 设置页「提醒」Tab 功能未实现
提醒设置仅有 UI 占位，`addReminder`/`updateReminder`/`deleteReminder` 方法在 store 中已实现但未在 Settings 页面调用。

#### 8. `ScheduleGrid` 中 `el-option` label 绑定错误
```12:206:src/components/schedule/ScheduleGrid.vue
:label="course.name"
```
这里用了单引号包裹 `course.name`，实际上会被当作字符串字面量 `"course.name"` 而非表达式。应改用 `:label="course.name"` 的正确写法——但当前代码确实写的是 `label="course.name"`（不带冒号），导致下拉框选项显示的是文本 `course.name` 而非课程名称。

#### 9. `el-card` 的 `@click` 事件在 Element Plus 中不生效
`Home.vue` 中 `<el-card @click="...">` 不会触发点击事件，`el-card` 不原生支持 click。需要包裹一层 `div` 或使用 `@click.native`（Vue 3 中已移除 `.native`，需用 `div` 包裹）。

---

### 🟡 代码质量问题

#### 10. `substr` 已废弃
```6:src/utils/index.ts
return Date.now().toString(36) + Math.random().toString(36).substr(2)
```
`.substr()` 已废弃，应改为 `.substring(2)` 或 `.slice(2)`。

#### 11. `Course` 类型中 `createdAt: Date` 的 localStorage 序列化问题
```9:src/types/index.ts
createdAt: Date
updatedAt: Date
```
`getStorage` 用 `JSON.parse` 反序列化时，`Date` 对象会变成字符串。类型标注为 `Date` 但实际运行时是 `string`，存在类型不安全。应使用 `string`（ISO 格式）或在读取时做 `new Date()` 转换。

#### 12. `getDayName` 函数重复定义
`utils/index.ts` 和 `composables/useSchedule.ts` 各有一个 `getDayName`，逻辑不同（一个返回「周日」，一个返回「周一」），容易混淆。

#### 13. 大量 `!important` 和 `!` 非空断言
`style.css` 中有 30+ 处 `!important`；`ScheduleGrid.vue` 和 `Home.vue` 中多次使用 `!.course!` 非空断言（如 `getCourseAtSlot(day, slotIndex)!.course!`），不够健壮。

#### 14. `as any` 类型断言
```13:src/views/Home.vue
const todayName = getDayName(today as any)
```
`today` 是 `number`，被断言为 `any` 传入 `getDayName(day: DayOfWeek)`，绕过了类型检查。

#### 15. `todaySchedule` 不是响应式的
`useSchedule.ts` 中 `today` 是普通变量，`todaySchedule` 的 computed 依赖它，但如果应用跨天使用（午夜过后），`today` 不会更新。

#### 16. `layouts/` 和 `components/common/` 空目录
两个目录都是空的，`README` 中也未提及 `layouts/`，说明结构规划和实际实现不一致。

#### 17. Element Plus 全量注册
```14:src/main.ts
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```
图标全量注册会增加打包体积，建议按需导入或使用 `unplugin-icons`。同理 `app.use(ElementPlus)` 也是全量引入。

---

### 🔵 架构 / 工程建议

| # | 建议 | 说明 |
|---|------|------|
| 18 | **缺少测试** | 项目无任何单元测试 / E2E 测试，建议引入 Vitest |
| 19 | **缺少 ESLint / Prettier** | 无代码规范工具链，`package.json` 中无相关依赖 |
| 20 | **无 `.gitignore` 检查** | 确认 `dist/` 和 `node_modules/` 已被忽略 |
| 21 | **版本号未管理** | `package.json` version 为 `0.0.0`，Settings 页显示 `v1.0.0` |
| 22 | **路由无 404 处理** | 缺少 catch-all 路由，访问未定义路径会白屏 |
| 23 | **无路由过渡动画** | `App.vue` 中 `<router-view />` 未包裹 `<transition>`，虽然 `style.css` 定义了 `.fade` 动画但未使用 |

---

### 总结

| 维度 | 评价 |
|------|------|
| **项目结构** | ✅ 清晰规范，分层合理 |
| **TypeScript 类型** | ⚠️ 基本完整，但有 `any`/`!` 断言和 Date 序列化隐患 |
| **状态管理** | ✅ Pinia 使用得当，localStorage 持久化到位 |
| **UI / UX** | ⚠️ 多主题/深色模式实现好，但有多处功能未完成 |
| **功能完整度** | ⚠️ 核心功能可用，但数据管理/提醒功能/自定义时间未生效 |
| **测试 / 工程化** | ❌ 无测试、无 Lint、全量引入 Element Plus |

**最应优先修复的 3 个问题**：
1. `ScheduleGrid` 使用 `DEFAULT_TIME_SLOTS` 而非用户自定义时间段（功能不生效）
2. `el-option` 的 `label="course.name"` 语法错误（下拉显示错误）
3. 设置页数据管理按钮无功能（用户体验断裂）


---


## 修复完成项目 Review 报告里的问题

### Bug 修复

| # | 文件 | 修复内容 |
|---|------|----------|
| 1 | `index.html` | 标题改为「小学生课程表」，`lang` 改为 `zh-CN` |
| 2 | `src/views/Home.vue` | 「本周课程」统计从 `todaySchedule.length * 5` 改为遍历周一到周五实际课程数 |
| 3 | `src/components/schedule/ScheduleGrid.vue` | 从 `DEFAULT_TIME_SLOTS` 改为 `settingsStore.timeSlots`，用户自定义时间段生效 |
| 4 | `src/components/HelloWorld.vue` | 删除脚手架残留 |
| 5 | `src/components/schedule/TimeAxis.vue` | 删除未使用死代码 |
| 6 | `src/views/Settings.vue` | 实现导出数据（下载 JSON）、导入数据（上传 JSON）、清除所有数据（带确认弹窗） |
| 7 | `src/views/Settings.vue` | 实现提醒 CRUD（添加/编辑/删除弹窗 + 表格展示） |
| 8 | `src/views/Home.vue` | `el-card @click` 用 `div` 包裹使点击生效 |
| 9 | `src/utils/index.ts` | `.substr(2)` → `.slice(2)` |
| 10 | `src/types/index.ts` + `stores/course.ts` + `constants/index.ts` | `Date` → `string`（ISO 格式），修复 localStorage 序列化后类型不一致 |
| 11 | `src/composables/useSchedule.ts` + `src/utils/index.ts` | 统一 `getDayName` 为 1-7 格式，移除重复定义 |
| 12 | `src/composables/useSchedule.ts` | `today` 改为 `computed`，跨天时自动更新 |
| 13 | `src/views/Home.vue` | `as any` → `computed(() => getDayName(today.value))` |
| 14 | `src/views/Home.vue` | `item.course!` → `v-if="item.course"` 守卫 |
| 15 | `src/router/index.ts` | 添加 `/:pathMatch(.*)*` 404 catch-all 路由 |
| 16 | `src/views/NotFound.vue` | 新建 404 页面 |
| 17 | `src/App.vue` | `<router-view>` 包裹 `<transition name="fade">`，启用路由过渡动画 |
| 18 | 删除空目录 `src/layouts/`、`src/components/common/` |
| 19 | `package.json` | 版本号 `0.0.0` → `1.0.0` |
