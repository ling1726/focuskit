import './style.css'
import './umd';

import TrapScenario from "./scenarios/Trap";
import DisabledScenario from './scenarios/Disabled';
import TrapGroupScenario from './scenarios/TrapGroup';
import ArrowZoneScenario from './scenarios/List';
import ListGroup from './scenarios/ListGroup';
import ListInTrapGroup from './scenarios/ListInTrapGroup';

TrapGroupScenario(document.getElementById('app')!);
