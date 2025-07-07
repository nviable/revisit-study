import { AppShell, Button } from '@mantine/core';
import { Outlet } from 'react-router';
import { useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';
import { IconArrowLeft } from '@tabler/icons-react';
import { AppAside } from './interface/AppAside';
import { AppHeader } from './interface/AppHeader';
import { AppNavBar } from './interface/AppNavBar';
import { HelpModal } from './interface/HelpModal';
import { AlertModal } from './interface/AlertModal';
import { EventType } from '../store/types';
import { useStudyConfig } from '../store/hooks/useStudyConfig';
import { WindowEventsContext } from '../store/hooks/useWindowEvents';
import { useStoreSelector, useStoreDispatch, useStoreActions } from '../store/store';
import { AnalysisFooter } from './interface/AnalysisFooter';
import { useIsAnalysis } from '../store/hooks/useIsAnalysis';
import { useAuth } from '../store/hooks/useAuth';
import { ResolutionWarning } from './interface/ResolutionWarning';

export function StepRenderer() {
  const windowEvents = useRef<EventType[]>([]);
  const dispatch = useStoreDispatch();
  const { toggleStudyBrowser } = useStoreActions();

  const studyConfig = useStudyConfig();
  const windowEventDebounceTime = studyConfig.uiConfig.windowEventDebounceTime ?? 100;

  const showStudyBrowser = useStoreSelector((state) => state.showStudyBrowser);
  const analysisHasAudio = useStoreSelector((state) => state.analysisHasAudio);
  const modes = useStoreSelector((state) => state.modes);
  const { user } = useAuth();

  // Attach event listeners
  useEffect(() => {
    // Focus
    const focusListener = debounce((e: FocusEvent) => {
      windowEvents.current.push([Date.now(), 'focus', e.target instanceof HTMLElement ? e.target.tagName : '']);
    }, windowEventDebounceTime, { maxWait: windowEventDebounceTime });

    // Inputs
    const inputListener = debounce((e: InputEvent) => {
      windowEvents.current.push([Date.now(), 'input', e.data ?? '']);
    }, windowEventDebounceTime, { maxWait: windowEventDebounceTime });

    // Keyboard
    const keydownListener = debounce((e: KeyboardEvent) => {
      windowEvents.current.push([Date.now(), 'keydown', e.key]);
    }, windowEventDebounceTime, { maxWait: windowEventDebounceTime });
    const keyupListener = debounce((e: KeyboardEvent) => {
      windowEvents.current.push([Date.now(), 'keyup', e.key]);
    }, windowEventDebounceTime, { maxWait: windowEventDebounceTime });

    // Mouse/Pointer/Touch
    const mouseDownListener = debounce((e: MouseEvent) => {
      windowEvents.current.push([Date.now(), 'mousedown', [e.clientX, e.clientY]]);
    }, windowEventDebounceTime, { maxWait: windowEventDebounceTime });

    const mouseUpListener = debounce((e: MouseEvent) => {
      windowEvents.current.push([Date.now(), 'mouseup', [e.clientX, e.clientY]]);
    }, windowEventDebounceTime, { maxWait: windowEventDebounceTime });

    // Window resizing
    const resizeListener = debounce(() => {
      windowEvents.current.push([Date.now(), 'resize', [window.innerWidth, window.innerHeight]]);
    }, windowEventDebounceTime, { maxWait: windowEventDebounceTime });

    // Mouse movement
    const mouseMoveListener = debounce((e: MouseEvent) => {
      windowEvents.current.push([Date.now(), 'mousemove', [e.clientX, e.clientY]]);
    }, windowEventDebounceTime, { maxWait: windowEventDebounceTime });

    // Scroll
    const scrollListener = debounce(() => {
      windowEvents.current.push([Date.now(), 'scroll', [window.scrollX, window.scrollY]]);
    }, windowEventDebounceTime, { maxWait: windowEventDebounceTime });

    // Visibility change
    const visibilityListener = debounce(() => {
      windowEvents.current.push([Date.now(), 'visibility', document.visibilityState]);
    }, windowEventDebounceTime, { maxWait: windowEventDebounceTime });

    window.addEventListener('focus', focusListener, true);
    window.addEventListener('input', inputListener as () => void);
    window.addEventListener('keydown', keydownListener);
    window.addEventListener('keyup', keyupListener);
    window.addEventListener('mousedown', mouseDownListener);
    window.addEventListener('mouseup', mouseUpListener);
    window.addEventListener('resize', resizeListener);
    window.addEventListener('mousemove', mouseMoveListener);
    window.addEventListener('scroll', scrollListener);
    document.addEventListener('visibilitychange', visibilityListener);

    return () => {
      window.removeEventListener('focus', focusListener, true);
      window.removeEventListener('input', inputListener as () => void);
      window.removeEventListener('keydown', keydownListener);
      window.removeEventListener('keyup', keyupListener);
      window.removeEventListener('mousedown', mouseDownListener);
      window.removeEventListener('mouseup', mouseUpListener);
      window.removeEventListener('resize', resizeListener);
      window.removeEventListener('mousemove', mouseMoveListener);
      window.removeEventListener('scroll', scrollListener);
      document.removeEventListener('visibilitychange', visibilityListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sidebarWidth = studyConfig.uiConfig.sidebarWidth ?? 300;

  // Safely destructure modes, handling potential missing properties
  const { studyNavigatorEnabled, dataCollectionEnabled, studyNavigatorPubliclyAccessible } = useMemo(() => modes, [modes]);

  // Compute final study navigator visibility based on mode settings and admin status
  const finalStudyNavigatorVisible = useMemo(
    () => studyNavigatorEnabled && (studyNavigatorPubliclyAccessible || user.isAdmin),
    [studyNavigatorEnabled, studyNavigatorPubliclyAccessible, user.isAdmin],
  );

  const isAnalysis = useIsAnalysis();

  const asideOpen = useMemo(() => {
    if (isAnalysis) return true;
    return finalStudyNavigatorVisible && showStudyBrowser;
  }, [isAnalysis, finalStudyNavigatorVisible, showStudyBrowser]);

  return (
    <WindowEventsContext.Provider value={windowEvents}>
      <AppShell
        padding="md"
        header={{ height: studyConfig.uiConfig.showTitleBar === false ? 0 : 70 }}
        navbar={{ width: sidebarWidth, breakpoint: 'xs', collapsed: { desktop: !studyConfig.uiConfig.sidebar, mobile: !studyConfig.uiConfig.sidebar } }}
        aside={{ width: 360, breakpoint: 'xs', collapsed: { desktop: !asideOpen, mobile: !asideOpen } }}
        footer={{ height: (isAnalysis ? 75 : 0) + (analysisHasAudio ? 50 : 0) }}
      >
        <AppNavBar />
        <AppAside />
        {studyConfig.uiConfig.showTitleBar !== false && (
          <AppHeader
            studyNavigatorEnabled={finalStudyNavigatorVisible}
            dataCollectionEnabled={dataCollectionEnabled}
          />
        )}
        <ResolutionWarning />
        <HelpModal />
        <AlertModal />
        <AppShell.Main>
          {studyConfig.uiConfig.showTitleBar === false && !showStudyBrowser && studyNavigatorEnabled && (
            <Button
              variant="transparent"
              leftSection={<IconArrowLeft size={14} />}
              onClick={() => dispatch(toggleStudyBrowser())}
              size="xs"
              style={{ position: 'fixed', top: '10px', right: '10px' }}
            >
              Study Browser
            </Button>
          )}
          <Outlet />
        </AppShell.Main>
        {isAnalysis && (
          <AnalysisFooter />
        )}
      </AppShell>
    </WindowEventsContext.Provider>
  );
}
