// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package sqlstore

import (
	"github.com/mattermost/mattermost/server/public/shared/mlog"
)

var enableFullyParallelTests bool

func InitTest(logger mlog.LoggerIFace, runParallel bool) {
	enableFullyParallelTests = runParallel
	storeTypes = initStores(logger)
}

func TearDownTest() {
	tearDownGlobalStores()
}
